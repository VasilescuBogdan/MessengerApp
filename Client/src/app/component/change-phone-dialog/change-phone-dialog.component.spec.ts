import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePhoneDialogComponent } from './change-phone-dialog.component';

describe('ChangePhoneDialogComponent', () => {
  let component: ChangePhoneDialogComponent;
  let fixture: ComponentFixture<ChangePhoneDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePhoneDialogComponent]
    });
    fixture = TestBed.createComponent(ChangePhoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
