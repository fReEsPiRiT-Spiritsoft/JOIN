import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAssignees } from './task-assignees';

describe('TaskAssignees', () => {
  let component: TaskAssignees;
  let fixture: ComponentFixture<TaskAssignees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAssignees]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAssignees);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
