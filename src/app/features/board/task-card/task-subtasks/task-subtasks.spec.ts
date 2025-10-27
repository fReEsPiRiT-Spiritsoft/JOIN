import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSubtasks } from './task-subtasks';

describe('TaskSubtasks', () => {
  let component: TaskSubtasks;
  let fixture: ComponentFixture<TaskSubtasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskSubtasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskSubtasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
