import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsDressesComponent } from './kids-dresses.component';

describe('KidsDressesComponent', () => {
  let component: KidsDressesComponent;
  let fixture: ComponentFixture<KidsDressesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KidsDressesComponent]
    });
    fixture = TestBed.createComponent(KidsDressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
