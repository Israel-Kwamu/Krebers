import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenTShirtsComponent } from './men-tshirts.component';

describe('MenTShirtsComponent', () => {
  let component: MenTShirtsComponent;
  let fixture: ComponentFixture<MenTShirtsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenTShirtsComponent]
    });
    fixture = TestBed.createComponent(MenTShirtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
