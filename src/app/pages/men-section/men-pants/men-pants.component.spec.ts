import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenPantsComponent } from './men-pants.component';

describe('MenPantsComponent', () => {
  let component: MenPantsComponent;
  let fixture: ComponentFixture<MenPantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenPantsComponent]
    });
    fixture = TestBed.createComponent(MenPantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
