import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionPurchaseDateComponent } from './champion-purchase-date.component';

describe('ChampionPurchaseDateComponent', () => {
  let component: ChampionPurchaseDateComponent;
  let fixture: ComponentFixture<ChampionPurchaseDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChampionPurchaseDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionPurchaseDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
