import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenSectionComponent } from './men-section.component';

describe('MenSectionComponent', () => {
  let component: MenSectionComponent;
  let fixture: ComponentFixture<MenSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenSectionComponent]
    });
    fixture = TestBed.createComponent(MenSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
