import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserForumCommentsComponent } from './user-forum-comments.component';

describe('UserForumCommentsComponent', () => {
  let component: UserForumCommentsComponent;
  let fixture: ComponentFixture<UserForumCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserForumCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserForumCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
