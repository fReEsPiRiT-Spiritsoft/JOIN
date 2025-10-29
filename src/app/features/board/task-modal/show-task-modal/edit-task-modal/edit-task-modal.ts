import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, Subtask } from '../../../../../core/interfaces/board-tasks-interface';
import { Contact } from '../../../../../core/interfaces/db-contact-interface';
import { ContactService } from '../../../../../core/services/db-contact-service';
import { BoardTasksService } from '../../../../../core/services/board-tasks-service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-task-modal',
  imports: [CommonModule, FormsModule],
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

  // Form Data
  title = '';
  description = '';
  dueDate = '';
  priority: 'urgent' | 'medium' | 'low' = 'medium';
  category = '';
  selectedContactIds: string[] = [];
  subtasks: Subtask[] = [];
  newSubtaskTitle = '';
  editingSubtaskId: string | null = null;

  // Dropdown States
  showCategoryDropdown = false;
  showContactDropdown = false;

  // Data
  contacts: Contact[] = [];
  categories = ['Technical Task', 'User Story'];

  // Validation
  titleError = false;
  dueDateError = false;
  categoryError = false;

  // Loading State
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
        await new Promise(resolve => setTimeout(resolve, 50));
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

  populateForm() {
    if (!this.task) {
      return;
    }
    this.title = this.task.title;
    this.description = this.task.description;
    this.priority = this.task.priority;
    this.category = this.task.category;
    this.selectedContactIds = this.task.assignedTo ? [...this.task.assignedTo] : [];
    this.subtasks = this.task.subtasks ? JSON.parse(JSON.stringify(this.task.subtasks)) : [];
    if (this.task.dueDate) {
      const date = this.task.dueDate.toDate();
      this.dueDate = date.toISOString().split('T')[0];
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.showModal && !this.showCategoryDropdown && !this.showContactDropdown) {
      this.onClose();
    }
  }

  setPriority(priority: 'urgent' | 'medium' | 'low') {
    this.priority = priority;
  }

  toggleCategoryDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
    if (this.showCategoryDropdown) {
      this.showContactDropdown = false;
    }
  }

  selectCategory(category: string) {
    this.category = category;
    this.categoryError = false;
    this.showCategoryDropdown = false;
  }

  toggleContactDropdown() {
    this.showContactDropdown = !this.showContactDropdown;
    if (this.showContactDropdown) {
      this.showCategoryDropdown = false;
    }
  }

  toggleContact(contactId: string) {
    const index = this.selectedContactIds.indexOf(contactId);
    if (index > -1) {
      this.selectedContactIds.splice(index, 1);
    } else {
      this.selectedContactIds.push(contactId);
    }
  }

  isContactSelected(contactId: string): boolean {
    const isSelected = this.selectedContactIds.includes(contactId);
    return isSelected;
  }

  getSelectedContacts(): Contact[] {
    return this.contacts.filter((c) => this.selectedContactIds.includes(c.id!));
  }

  addSubtask() {
    if (this.newSubtaskTitle.trim()) {
      this.subtasks.push({
        id: Date.now().toString(),
        title: this.newSubtaskTitle.trim(),
        completed: false,
      });
      this.newSubtaskTitle = '';
    }
  }

  startEditSubtask(subtaskId: string) {
    this.editingSubtaskId = subtaskId;
  }

  saveSubtask(subtask: Subtask, newTitle: string) {
    if (newTitle.trim()) {
      subtask.title = newTitle.trim();
    }
    this.editingSubtaskId = null;
  }

  deleteSubtask(subtaskId: string) {
    this.subtasks = this.subtasks.filter((s) => s.id !== subtaskId);
  }

  getInitials(contact: Contact): string {
    if (!contact || !contact.firstname) return '';
    const nameParts = contact.firstname.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    const firstInitial = nameParts[0].charAt(0);
    const lastInitial = nameParts[nameParts.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
  }

  colorPalette = [
    '#FF7A00', '#9327FF', '#6E52FF', '#FC71FF', '#FFBB2B', '#1FD7C1',
    '#462F8A', '#FF4646', '#00BEE8', '#FF5EB3', '#FF745E', '#FFA35E',
    '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B',
  ];

  getAvatarColor(contact: Contact): string {
    let hash = 0;
    const idString = String(contact.id);
    for (let i = 0; i < idString.length; i++) {
      hash = idString.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % this.colorPalette.length;
    return this.colorPalette[index];
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
      isValid = false;
    } else {
      this.dueDateError = false;
    }

    if (!this.category) {
      this.categoryError = true;
      isValid = false;
    } else {
      this.categoryError = false;
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
    const dueDateTimestamp = Timestamp.fromDate(new Date(this.dueDate));
    const updates: Partial<Task> = {
      title: this.title.trim(),
      description: this.description.trim(),
      dueDate: dueDateTimestamp,
      priority: this.priority,
      category: this.category,
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
    this.priority = 'medium';
    this.category = '';
    this.selectedContactIds = [];
    this.subtasks = [];
    this.newSubtaskTitle = '';
    this.titleError = false;
    this.dueDateError = false;
    this.categoryError = false;
    this.showCategoryDropdown = false;
    this.showContactDropdown = false;
  }

  onClose() {
    this.resetForm();
    this.closeModal.emit();
  }

  onOverlayClick() {
    this.onClose();
  }

  onModalClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.dropdown-wrapper');
    if (!clickedInsideDropdown) {
      this.showCategoryDropdown = false;
      this.showContactDropdown = false;
    }
    event.stopPropagation();
  }
}