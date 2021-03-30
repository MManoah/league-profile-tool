import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChibiComponent } from './chibi.component';

describe('ChibiComponent', () => {
  let component: ChibiComponent;
  let fixture: ComponentFixture<ChibiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChibiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChibiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
