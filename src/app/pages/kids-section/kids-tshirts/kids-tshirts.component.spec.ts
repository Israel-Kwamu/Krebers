import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsTshirtsComponent } from './kids-tshirts.component';

describe('KidsTshirtsComponent', () => {
  let component: KidsTshirtsComponent;
  let fixture: ComponentFixture<KidsTshirtsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KidsTshirtsComponent]
    });
    fixture = TestBed.createComponent(KidsTshirtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
