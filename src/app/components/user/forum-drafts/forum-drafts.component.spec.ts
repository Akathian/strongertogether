import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDraftsComponent } from './forum-drafts.component';

describe('ForumDraftsComponent', () => {
  let component: ForumDraftsComponent;
  let fixture: ComponentFixture<ForumDraftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumDraftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumDraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
