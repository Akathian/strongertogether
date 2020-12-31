import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinBlogFooterComponent } from './pin-blog-footer.component';

describe('PinBlogFooterComponent', () => {
  let component: PinBlogFooterComponent;
  let fixture: ComponentFixture<PinBlogFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinBlogFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinBlogFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
