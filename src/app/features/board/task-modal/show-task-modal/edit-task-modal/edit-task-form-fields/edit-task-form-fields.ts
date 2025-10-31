import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-task-form-fields',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-task-form-fields.html',
  styleUrl: './edit-task-form-fields.scss',
  standalone: true,
})
export class EditTaskFormFieldsComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() dueDate = '';
  @Input() hiddenDateValue = '';
  @Input() titleError = false;
  @Input() dueDateError = false;
  @Input() dueDateErrorMessage = 'This field is required';
  @Input() minDate = '';

  @Output() titleChange = new EventEmitter<string>();
  @Output() descriptionChange = new EventEmitter<string>();
  @Output() dueDateChange = new EventEmitter<string>();
  @Output() hiddenDateValueChange = new EventEmitter<string>();
  @Output() titleErrorChange = new EventEmitter<boolean>();
  @Output() dueDateErrorChange = new EventEmitter<boolean>();
  @Output() dueDateErrorMessageChange = new EventEmitter<string>();

  @ViewChild('datePicker') datePicker!: ElementRef<HTMLInputElement>;

  onTitleChange(value: string) {
    this.title = value;
    this.titleChange.emit(value);
    if (this.titleError) {
      this.titleError = false;
      this.titleErrorChange.emit(false);
    }
  }

  onDescriptionChange(value: string) {
    this.description = value;
    this.descriptionChange.emit(value);
  }

  formatDateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }

    this.dueDate = value;
    this.dueDateChange.emit(value);

    if (value.length === 10) {
      this.validateDate(value);
    }
  }

  validateDate(dateString: string) {
    const [day, month, year] = dateString.split('/');

    if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
      const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        this.dueDateError = true;
        this.dueDateErrorMessage = 'Date cannot be in the past';
        this.dueDateErrorChange.emit(true);
        this.dueDateErrorMessageChange.emit(this.dueDateErrorMessage);
      } else {
        this.dueDateError = false;
        this.dueDateErrorChange.emit(false);
      }
    } else {
      this.dueDateError = true;
      this.dueDateErrorMessage = 'Invalid date format';
      this.dueDateErrorChange.emit(true);
      this.dueDateErrorMessageChange.emit(this.dueDateErrorMessage);
    }
  }

  openDatePicker() {
    this.datePicker.nativeElement.showPicker();
  }

  onDatePickerChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const dateValue = input.value;

    if (dateValue) {
      const [year, month, day] = dateValue.split('-');
      this.dueDate = `${day}/${month}/${year}`;
      this.dueDateChange.emit(this.dueDate);
      this.hiddenDateValue = dateValue;
      this.hiddenDateValueChange.emit(dateValue);

      if (this.dueDateError) {
        this.dueDateError = false;
        this.dueDateErrorChange.emit(false);
      }
    }
  }
}
