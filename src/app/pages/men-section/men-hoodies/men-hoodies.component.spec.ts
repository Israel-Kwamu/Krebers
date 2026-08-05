import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenHoodiesComponent } from './men-hoodies.component';

describe('MenHoodiesComponent', () => {
  let component: MenHoodiesComponent;
  let fixture: ComponentFixture<MenHoodiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenHoodiesComponent]
    });
    fixture = TestBed.createComponent(MenHoodiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
