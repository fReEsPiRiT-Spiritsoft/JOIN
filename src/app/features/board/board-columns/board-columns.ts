import { Component, Input, Output, EventEmitter, inject, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Task } from '../../../core/interfaces/board-tasks-interface';
import { TaskCard } from '../task-card/task-card';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardTasksService } from '../../../core/services/board-tasks-service';
import { Firestore, writeBatch, doc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-columns',
  imports: [CommonModule, TaskCard, CdkDropList, CdkDrag],
  templateUrl: './board-columns.html',
  styleUrl: './board-columns.scss',
  standalone: true,
})
export class BoardColumns implements OnInit {
  @Input() title: string = '';
  @Input() tasks: Task[] = [];
  @Input() columnId: string = '';
  @Input() showAddButton: boolean = true;
  @Output() addTaskClicked = new EventEmitter<string>();
  @Output() taskClicked = new EventEmitter<Task>();
  @Output() taskDropped = new EventEmitter<CdkDragDrop<Task[]>>();
  @Output() subtaskToggled = new EventEmitter<{ task: Task; subtask: any }>();
  @Output() moveTaskRequested = new EventEmitter<{ task: Task; targetColumn: string }>();

  private taskService = inject(BoardTasksService);
  private firestore = inject(Firestore);
  private router = inject(Router); 

  isHovering = false;
  isMobile = false; 
  isTabletOrBelow = false;
  showMoveMenu: { [key: string]: boolean } = {};

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 1024; 
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  get addTaskIcon(): string {
    return this.isHovering ? 'assets/board/add-task-v2.png' : 'assets/board/add-task-v4.png';
  }

  onAddTaskClick() {
    if (this.isMobile) {
      this.router.navigate(['/add-task']);
    } else {
      this.addTaskClicked.emit(this.columnId);
    }
  }

  onTaskClick(task: Task) {
    this.taskClicked.emit(task);
  }

  onSubtaskToggled(event: { task: Task; subtask: any }) {
    this.subtaskToggled.emit(event);
  }

  toggleMoveMenu(taskId: string, event: Event) {
    event.stopPropagation();
    this.showMoveMenu[taskId] = !this.showMoveMenu[taskId];
  }

  moveTaskToColumn(task: Task, targetColumn: string, event: Event) {
    event.stopPropagation();
    this.moveTaskRequested.emit({ task, targetColumn }); // ✅ Nur task und targetColumn
    this.showMoveMenu[task.id!] = false;
  }

  async onDrop(event: CdkDragDrop<Task[]>) {
    if (this.isMobile) { // ✅ isMobile Check
      return;
    }

    const task = event.item.data as Task;
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      await this.updateTaskOrder(event.container.data);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      task.status = this.columnId as 'todo' | 'inprogress' | 'awaitfeedback' | 'done';
      await this.taskService.updateTask(task.id!, task);
      await this.updateTaskOrder(event.previousContainer.data);
      await this.updateTaskOrder(event.container.data);
    }
    
    this.taskDropped.emit(event);
  }

  private async updateTaskOrder(tasks: Task[]) {
    const batch = writeBatch(this.firestore);
    
    tasks.forEach((task, index) => {
      if (task.id) {
        const taskRef = doc(this.firestore, 'tasks', task.id);
        batch.update(taskRef, { order: index });
      }
    });

    await batch.commit();
  }
}