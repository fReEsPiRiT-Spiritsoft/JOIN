import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigneeAvatar } from './assignee-avatar';

describe('AssigneeAvatar', () => {
  let component: AssigneeAvatar;
  let fixture: ComponentFixture<AssigneeAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssigneeAvatar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssigneeAvatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
