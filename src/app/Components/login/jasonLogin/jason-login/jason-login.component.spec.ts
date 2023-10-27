import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JasonLoginComponent } from './jason-login.component';

describe('JasonLoginComponent', () => {
  let component: JasonLoginComponent;
  let fixture: ComponentFixture<JasonLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JasonLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JasonLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
