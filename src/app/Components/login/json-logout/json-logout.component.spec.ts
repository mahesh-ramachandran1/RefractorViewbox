import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JasonLogoutComponent } from './json-logout.component';

describe('JasonLogoutComponent', () => {
  let component: JasonLogoutComponent;
  let fixture: ComponentFixture<JasonLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JasonLogoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JasonLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
