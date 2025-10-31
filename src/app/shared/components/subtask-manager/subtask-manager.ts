import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subtask } from '../../../core/interfaces/board-tasks-interface';

@Component({
  selector: 'app-subtask-manager',
  imports: [CommonModule, FormsModule],
  templateUrl: './subtask-manager.html',
  styleUrl: './subtask-manager.scss',
  standalone: true,
})
export class SubtaskManagerComponent {
  @Input() subtasks: Subtask[] = [];
  @Output() subtasksChange = new EventEmitter<Subtask[]>();

  newSubtaskTitle = '';
  editingSubtaskId: string | null = null;
  subtaskInputFocused = false;

  onSubtaskInputFocus() {
    this.subtaskInputFocused = true;
  }

  onSubtaskInputBlur() {
    setTimeout(() => {
      if (!this.newSubtaskTitle) {
        this.subtaskInputFocused = false;
      }
    }, 200);
  }

  clearSubtaskInput() {
    this.newSubtaskTitle = '';
    this.subtaskInputFocused = false;
  }

  addSubtask() {
    if (this.newSubtaskTitle.trim()) {
      const updatedSubtasks = [
        ...this.subtasks,
        {
          id: Date.now().toString(),
          title: this.newSubtaskTitle.trim(),
          completed: false,
        },
      ];
      this.subtasks = updatedSubtasks;
      this.subtasksChange.emit(updatedSubtasks);
      this.newSubtaskTitle = '';
    }
  }

  startEditSubtask(subtaskId: string) {
    this.editingSubtaskId = subtaskId;
  }

  saveSubtask(subtask: Subtask, newTitle: string) {
    if (newTitle.trim()) {
      subtask.title = newTitle.trim();
      this.subtasksChange.emit([...this.subtasks]);
    }
    this.editingSubtaskId = null;
  }

  deleteSubtask(subtaskId: string) {
    const updatedSubtasks = this.subtasks.filter((s) => s.id !== subtaskId);
    this.subtasks = updatedSubtasks;
    this.subtasksChange.emit(updatedSubtasks);
  }

  onSubtaskCloseHover(imgElement: HTMLImageElement) {
    imgElement.src = 'assets/board/close-hover-board.png';
  }

  onSubtaskCloseLeave(imgElement: HTMLImageElement) {
    imgElement.src = 'assets/board/close-default-board.png';
  }

  onSubtaskCheckHover(imgElement: HTMLImageElement) {
    imgElement.src = 'assets/board/check-dark-hover.png';
  }

  onSubtaskCheckLeave(imgElement: HTMLImageElement) {
    imgElement.src = 'assets/board/check-dark-default.png';
  }
}
