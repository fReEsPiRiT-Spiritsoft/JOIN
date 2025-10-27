import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCategoryBadge } from './task-category-badge';

describe('TaskCategoryBadge', () => {
  let component: TaskCategoryBadge;
  let fixture: ComponentFixture<TaskCategoryBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCategoryBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCategoryBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
