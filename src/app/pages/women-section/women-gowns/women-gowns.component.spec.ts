import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenGownsComponent } from './women-gowns.component';

describe('WomenGownsComponent', () => {
  let component: WomenGownsComponent;
  let fixture: ComponentFixture<WomenGownsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WomenGownsComponent]
    });
    fixture = TestBed.createComponent(WomenGownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
