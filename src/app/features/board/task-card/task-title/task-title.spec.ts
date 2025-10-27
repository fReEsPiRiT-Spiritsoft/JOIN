import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTitle } from './task-title';

describe('TaskTitle', () => {
  let component: TaskTitle;
  let fixture: ComponentFixture<TaskTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskTitle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskTitle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
