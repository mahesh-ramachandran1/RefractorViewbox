import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassawordTextBoxComponent } from './passaword-text-box.component';

describe('PassawordTextBoxComponent', () => {
  let component: PassawordTextBoxComponent;
  let fixture: ComponentFixture<PassawordTextBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassawordTextBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassawordTextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
