import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomePortalComponent } from './welcome-portal.component';

describe('WelcomePortalComponent', () => {
  let component: WelcomePortalComponent;
  let fixture: ComponentFixture<WelcomePortalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomePortalComponent]
    });
    fixture = TestBed.createComponent(WelcomePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
