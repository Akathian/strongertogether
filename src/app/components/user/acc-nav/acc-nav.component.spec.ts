import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccNavComponent } from './acc-nav.component';

describe('AccNavComponent', () => {
  let component: AccNavComponent;
  let fixture: ComponentFixture<AccNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
