import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnEmptyState } from './column-empty-state';

describe('ColumnEmptyState', () => {
  let component: ColumnEmptyState;
  let fixture: ComponentFixture<ColumnEmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnEmptyState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnEmptyState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
