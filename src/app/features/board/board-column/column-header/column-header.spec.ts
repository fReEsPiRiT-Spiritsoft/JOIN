import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnHeader } from './column-header';

describe('ColumnHeader', () => {
  let component: ColumnHeader;
  let fixture: ComponentFixture<ColumnHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
