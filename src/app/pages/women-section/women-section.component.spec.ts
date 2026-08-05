import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenSectionComponent } from './women-section.component';

describe('WomenSectionComponent', () => {
  let component: WomenSectionComponent;
  let fixture: ComponentFixture<WomenSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WomenSectionComponent]
    });
    fixture = TestBed.createComponent(WomenSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
