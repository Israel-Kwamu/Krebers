import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenNativeComponent } from './men-native.component';

describe('MenNativeComponent', () => {
  let component: MenNativeComponent;
  let fixture: ComponentFixture<MenNativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenNativeComponent]
    });
    fixture = TestBed.createComponent(MenNativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
