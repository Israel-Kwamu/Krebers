import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenJoggersComponent } from './women-joggers.component';

describe('WomenJoggersComponent', () => {
  let component: WomenJoggersComponent;
  let fixture: ComponentFixture<WomenJoggersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WomenJoggersComponent]
    });
    fixture = TestBed.createComponent(WomenJoggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
