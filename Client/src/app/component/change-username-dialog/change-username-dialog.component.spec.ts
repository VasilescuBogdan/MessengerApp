import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUsernameDialogComponent } from './change-username-dialog.component';

describe('ChangeUsernameDialogComponent', () => {
  let component: ChangeUsernameDialogComponent;
  let fixture: ComponentFixture<ChangeUsernameDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeUsernameDialogComponent]
    });
    fixture = TestBed.createComponent(ChangeUsernameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
