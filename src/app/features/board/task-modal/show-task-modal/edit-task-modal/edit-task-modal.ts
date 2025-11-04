import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, Subtask } from '../../../../../core/interfaces/board-tasks-interface';
import { Contact } from '../../../../../core/interfaces/db-contact-interface';
import { ContactService } from '../../../../../core/services/db-contact-service';
import { BoardTasksService } from '../../../../../core/services/board-tasks-service';
import { Timestamp } from '@angular/fire/firestore';
import { PrioritySelectorComponent } from '../../../../../shared/components/priority-selector/priority-selector';
import { SubtaskManagerComponent } from '../../../../../shared/components/subtask-manager/subtask-manager';
import { EditTaskFormFieldsComponent } from './edit-task-form-fields/edit-task-form-fields';
import { ContactAssignmentDropdownComponent } from './contact-assignment-dropdown/contact-assignment-dropdown';

@Component({
  selector: 'app-edit-task-modal',
  imports: [
    CommonModule,
    PrioritySelectorComponent,
    SubtaskManagerComponent,
    EditTaskFormFieldsComponent,
    ContactAssignmentDropdownComponent,
  ],
  templateUrl: './edit-task-modal.html',
  styleUrl: './edit-task-modal.scss',
  standalone: true,
})
export class EditTaskModal implements OnInit, OnChanges {
  @Input() showModal = false;
  @Input() task: Task | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<Task>();

  private contactService = inject(ContactService);
  private taskService = inject(BoardTasksService);

  title = '';
  description = '';
  dueDate = '';
  hiddenDateValue = '';
  minDate = this.getTodayDateString();
  priority: 'urgent' | 'medium' | 'low' = 'medium';
  selectedContactIds: string[] = [];
  subtasks: Subtask[] = [];

  contacts: Contact[] = [];

  titleError = false;
  dueDateError = false;
  dueDateErrorMessage = 'This field is required';

  isLoadingContacts = false;
  contactsLoaded = false;

  async ngOnInit() {
    await this.loadContacts();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['showModal'] && this.showModal && this.task) {
      if (!this.contactsLoaded && !this.isLoadingContacts) {
        await this.loadContacts();
      }
      while (this.isLoadingContacts) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      this.populateForm();
    }
    if (changes['task'] && !changes['task'].firstChange && this.showModal && this.task) {
      this.populateForm();
    }
  }

  async loadContacts() {
    if (this.isLoadingContacts || this.contactsLoaded) {
      return;
    }

    this.isLoadingContacts = true;
    try {
      this.contacts = await this.contactService.getAllContacts();
      this.contactsLoaded = true;
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      this.isLoadingContacts = false;
    }
  }

  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  populateForm() {
    if (!this.task) {
      return;
    }
    this.title = this.task.title;
    this.description = this.task.description;
    this.priority = this.task.priority;
    this.selectedContactIds = this.task.assignedTo ? [...this.task.assignedTo] : [];
    this.subtasks = this.task.subtasks ? JSON.parse(JSON.stringify(this.task.subtasks)) : [];
    if (this.task.dueDate) {
      const date = this.task.dueDate.toDate();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      this.dueDate = `${day}/${month}/${year}`;
      this.hiddenDateValue = `${year}-${month}-${day}`;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.showModal) {
      this.onClose();
    }
  }

  validateForm(): boolean {
    let isValid = true;

    if (!this.title.trim()) {
      this.titleError = true;
      isValid = false;
    } else {
      this.titleError = false;
    }

    if (!this.dueDate) {
      this.dueDateError = true;
      this.dueDateErrorMessage = 'This field is required';
      isValid = false;
    } else {
      const [day, month, year] = this.dueDate.split('/');
      if (day && month && year) {
        const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          this.dueDateError = true;
          this.dueDateErrorMessage = 'Date cannot be in the past';
          isValid = false;
        } else {
          this.dueDateError = false;
        }
      } else {
        this.dueDateError = true;
        this.dueDateErrorMessage = 'Invalid date format';
        isValid = false;
      }
    }

    return isValid;
  }

  async onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    if (!this.task || !this.task.id) {
      console.error('No task or task.id');
      return;
    }

    const [day, month, year] = this.dueDate.split('/');
    const dueDateTimestamp = Timestamp.fromDate(
      new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    );
    const updates: Partial<Task> = {
      title: this.title.trim(),
      description: this.description.trim(),
      dueDate: dueDateTimestamp,
      priority: this.priority,
      assignedTo: [...this.selectedContactIds],
      subtasks: [...this.subtasks],
      updatedAt: Timestamp.now(),
    };
    try {
      await this.taskService.updateTask(this.task.id, updates);
      const updatedTask: Task = {
        ...this.task,
        ...updates,
      };
      this.taskUpdated.emit(updatedTask);
      this.onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.dueDate = '';
    this.hiddenDateValue = '';
    this.priority = 'medium';
    this.selectedContactIds = [];
    this.subtasks = [];
    this.titleError = false;
    this.dueDateError = false;
    this.dueDateErrorMessage = 'This field is required';
  }

  onClose() {
    this.resetForm();
    this.closeModal.emit();
  }

  onOverlayClick() {
    this.onClose();
  }

  onModalClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onCloseHover(imgElement: HTMLImageElement) {
    imgElement.src = 'assets/board/close-hover-board.png';
  }

  onCloseLeave(imgElement: HTMLImageElement) {
    imgElement.src = 'assets/board/close-default-board.png';
  }
}
