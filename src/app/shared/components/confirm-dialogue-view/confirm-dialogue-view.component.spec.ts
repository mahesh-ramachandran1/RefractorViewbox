import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogueViewComponent } from './confirm-dialogue-view.component';

describe('ConfirmDialogueViewComponent', () => {
  let component: ConfirmDialogueViewComponent;
  let fixture: ComponentFixture<ConfirmDialogueViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogueViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
