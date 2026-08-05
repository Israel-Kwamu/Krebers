import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenSkirtsComponent } from './women-skirts.component';

describe('WomenSkirtsComponent', () => {
  let component: WomenSkirtsComponent;
  let fixture: ComponentFixture<WomenSkirtsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WomenSkirtsComponent]
    });
    fixture = TestBed.createComponent(WomenSkirtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
