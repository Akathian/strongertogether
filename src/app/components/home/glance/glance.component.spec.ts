import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlanceComponent } from './glance.component';

describe('GlanceComponent', () => {
  let component: GlanceComponent;
  let fixture: ComponentFixture<GlanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
