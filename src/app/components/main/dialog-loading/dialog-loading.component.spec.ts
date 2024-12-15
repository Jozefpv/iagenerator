import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLoadingComponent } from './dialog-loading.component';

describe('DialogLoadingComponent', () => {
  let component: DialogLoadingComponent;
  let fixture: ComponentFixture<DialogLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogLoadingComponent]
    });
    fixture = TestBed.createComponent(DialogLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
