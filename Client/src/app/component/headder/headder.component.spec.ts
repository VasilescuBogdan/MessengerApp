import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadderComponent } from './headder.component';

describe('HeadderComponent', () => {
  let component: HeadderComponent;
  let fixture: ComponentFixture<HeadderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadderComponent]
    });
    fixture = TestBed.createComponent(HeadderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
