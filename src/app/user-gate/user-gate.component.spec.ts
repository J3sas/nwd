import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGateComponent } from './user-gate.component';

describe('UserGateComponent', () => {
  let component: UserGateComponent;
  let fixture: ComponentFixture<UserGateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
