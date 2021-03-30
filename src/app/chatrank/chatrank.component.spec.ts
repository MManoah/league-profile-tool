import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatrankComponent } from './chatrank.component';

describe('ChatrankComponent', () => {
  let component: ChatrankComponent;
  let fixture: ComponentFixture<ChatrankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatrankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatrankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
