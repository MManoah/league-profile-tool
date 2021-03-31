import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticetoolComponent } from './practicetool.component';

describe('PracticetoolComponent', () => {
  let component: PracticetoolComponent;
  let fixture: ComponentFixture<PracticetoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticetoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticetoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
