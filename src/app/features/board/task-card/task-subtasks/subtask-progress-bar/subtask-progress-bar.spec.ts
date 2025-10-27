import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtaskProgressBar } from './subtask-progress-bar';

describe('SubtaskProgressBar', () => {
  let component: SubtaskProgressBar;
  let fixture: ComponentFixture<SubtaskProgressBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtaskProgressBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtaskProgressBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
