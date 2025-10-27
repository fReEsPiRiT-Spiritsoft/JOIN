import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPriority } from './task-priority';

describe('TaskPriority', () => {
  let component: TaskPriority;
  let fixture: ComponentFixture<TaskPriority>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPriority]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPriority);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
