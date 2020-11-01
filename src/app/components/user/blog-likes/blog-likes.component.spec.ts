import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogLikesComponent } from './blog-likes.component';

describe('BlogLikesComponent', () => {
  let component: BlogLikesComponent;
  let fixture: ComponentFixture<BlogLikesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogLikesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogLikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
