import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  where,
  setDoc,
  getDoc,
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Task, Subtask, BoardSettings } from '../interfaces/board-tasks-interface';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class BoardTasksService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService); 
  private tasksCollection = collection(this.firestore, 'tasks');
  private settingsCollection = collection(this.firestore, 'boardSettings');
  
  private viewModeSubject = new BehaviorSubject<'public' | 'private'>('public');
  public viewMode$ = this.viewModeSubject.asObservable();

  constructor() {
    this.loadUserSettings(); 
  }


  
  /**
   * Lädt gespeicherte View-Mode Einstellung
   */
  private async loadUserSettings() {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return;

    const settingsDoc = doc(this.firestore, `boardSettings/${user.id}`);
    const snapshot = await getDoc(settingsDoc);

    if (snapshot.exists()) {
      const data = snapshot.data() as BoardSettings;
      this.viewModeSubject.next(data.viewMode);
    }
  }

  /**
   * Wechselt zwischen Public/Private
   */
  async toggleViewMode(mode: 'public' | 'private'): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return;

    const settingsDoc = doc(this.firestore, `boardSettings/${user.id}`);
    await setDoc(settingsDoc, {
      userId: user.id,
      viewMode: mode,
      lastChanged: Timestamp.now()
    });

    this.viewModeSubject.next(mode);
  }

  /**
   *  Tasks basierend auf View Mode abrufen
   */
  getAllTasks(): Observable<Task[]> {
  return combineLatest([
    this.viewMode$,
    this.authService.currentUser$
  ]).pipe(
    switchMap(([viewMode, user]) => {
      if (viewMode === 'private' && user?.id) {
        // ✅ Private Mode: Nur eigene private Tasks
        const privateQuery = query(
          this.tasksCollection,
          where('isPrivate', '==', true),
          where('ownerId', '==', user.id)
        );
        return collectionData(privateQuery, { idField: 'id' }) as Observable<Task[]>;
      } else {
        // ✅ Public Mode: Alle Tasks laden und client-seitig filtern
        return (collectionData(this.tasksCollection, { idField: 'id' }) as Observable<Task[]>).pipe(
          map(tasks => tasks.filter(task => {
            // Zeige Tasks die:
            // - kein isPrivate Feld haben (alte Tasks)
            // - isPrivate === false haben
            // - isPrivate === undefined haben
            return task.isPrivate !== true;
          }))
        );
      }
    })
  );
}

  /**
   * Tasks nach Status gruppiert abrufen
   */
  getTasksByStatus(): Observable<{
    todo: Task[];
    inprogress: Task[];
    awaitfeedback: Task[];
    done: Task[];
  }> {
    return this.getAllTasks().pipe(
      map((tasks) => ({
        todo: tasks.filter((t) => t.status === 'todo'),
        inprogress: tasks.filter((t) => t.status === 'inprogress'),
        awaitfeedback: tasks.filter((t) => t.status === 'awaitfeedback'),
        done: tasks.filter((t) => t.status === 'done'),
      }))
    );
  }

  /**
   * Neuen Task erstellen
   */
  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<string> {
    const user = this.authService.getCurrentUser();
    const currentViewMode = this.viewModeSubject.value;
    const taskData = {
      ...task,
      isPrivate: currentViewMode === 'private',
      ownerId: user?.id || 'guest',
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(this.tasksCollection, taskData);
    return docRef.id;
  }

  /**
   * Aktuellen View Mode abrufen
   */
  getCurrentViewMode(): 'public' | 'private' {
    return this.viewModeSubject.value;
  }

  /**
   * Task aktualisieren
   */
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    const updateData: any = { ...updates };
    if (updates.assignedTo !== undefined) {
      updateData.assignedTo = updates.assignedTo;
    }
    try {
      await updateDoc(taskDoc, updateData);
    } catch (error) {
      console.error('Firestore update failed:', error);
      throw error;
    }
  }

  async updateTaskStatus(
    taskId: string,
    newStatus: 'todo' | 'inprogress' | 'awaitfeedback' | 'done'
  ): Promise<void> {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    await updateDoc(taskDoc, {
      status: newStatus,
      updatedAt: Timestamp.now()
    });
  }

  /**
   * Task löschen
   */
  async deleteTask(taskId: string): Promise<void> {
    const taskDoc = doc(this.firestore, 'tasks', taskId);
    await deleteDoc(taskDoc);
  }

  /**
   * Task in neue Spalte verschieben (Drag & Drop)
   */
  async moveTask(
    taskId: string,
    newStatus: 'todo' | 'inprogress' | 'awaitfeedback' | 'done'
  ): Promise<void> {
    const taskDoc = doc(this.firestore, 'tasks', taskId);
    await updateDoc(taskDoc, { status: newStatus });
  }
}