import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsNativeComponent } from './kids-native.component';

describe('KidsNativeComponent', () => {
  let component: KidsNativeComponent;
  let fixture: ComponentFixture<KidsNativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KidsNativeComponent]
    });
    fixture = TestBed.createComponent(KidsNativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
