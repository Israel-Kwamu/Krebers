import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsHoodiesComponent } from './kids-hoodies.component';

describe('KidsHoodiesComponent', () => {
  let component: KidsHoodiesComponent;
  let fixture: ComponentFixture<KidsHoodiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KidsHoodiesComponent]
    });
    fixture = TestBed.createComponent(KidsHoodiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
