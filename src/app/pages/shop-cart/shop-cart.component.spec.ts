import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopComponent } from './shop-cart.component';

describe('ShopCartComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopComponent]
    });
    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
