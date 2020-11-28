import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BlogComponent } from './components/blog/blog.component';
import { AboutComponent } from './components/about/about.component';
import { ForumComponent } from './components/forum/forum.component';
import { NavComponent } from './components/shared/nav/nav.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { UserComponent } from './components/user/user.component';
import { TitleComponent } from './components/home/title/title.component';
import { SlideshowComponent } from './components/home/slideshow/slideshow.component';
import { GlanceComponent } from './components/home/glance/glance.component';
import { QuoteComponent } from './components/home/quote/quote.component';
import { ProgramsComponent } from './components/programs/programs.component';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PostComponent } from './components/blog/post/post.component';
import { BlogNavComponent } from './components/blog/blog-nav/blog-nav.component';
import { CommentsComponent } from './components/blog/post/comments/comments.component';
import { RepliesComponent } from './components/blog/post/replies/replies.component';
import { AccNavComponent } from './components/user/acc-nav/acc-nav.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { BookingsComponent } from './components/user/bookings/bookings.component';
import { BlogPostsComponent } from './components/user/blog-posts/blog-posts.component';
import { BlogCommentsComponent } from './components/user/blog-comments/blog-comments.component';
import { BlogLikesComponent } from './components/user/blog-likes/blog-likes.component';
import { DraftsComponent } from './components/user/drafts/drafts.component';
import { ForumCommentsComponent } from './components/user/forum-comments/forum-comments.component';
import { ForumPostsComponent } from './components/user/forum-posts/forum-posts.component';
// import { EditorModule } from '@tinymce/tinymce-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BlogEditComponent } from './components/blog/blog-edit/blog-edit.component';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { NgxTextOverflowClampModule } from "ngx-text-overflow-clamp";
import { GearComponent } from './components/shared/gear/gear.component';
import { HttpClientModule } from "@angular/common/http";

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BlogFooterComponent } from './components/blog/blog-footer/blog-footer.component';
import { TimeParsePipe } from './pipes/time-parse.pipe';
import { ReadParsePipe } from './pipes/read-parse.pipe';
import { BugReportComponent } from './components/bug-report/bug-report.component';
import { PrivacyComponent } from './components/legal/privacy/privacy.component';
import { TermsComponent } from './components/legal/terms/terms.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BlogComponent,
    AboutComponent,
    ForumComponent,
    NavComponent,
    FooterComponent,
    UserComponent,
    TitleComponent,
    SlideshowComponent,
    GlanceComponent,
    QuoteComponent,
    ProgramsComponent,
    PostComponent,
    BlogNavComponent,
    CommentsComponent,
    RepliesComponent,
    AccNavComponent,
    ProfileComponent,
    BookingsComponent,
    BlogPostsComponent,
    BlogCommentsComponent,
    BlogLikesComponent,
    DraftsComponent,
    ForumCommentsComponent,
    ForumPostsComponent,
    BlogEditComponent,
    SanitizeHtmlPipe,
    GearComponent,
    BlogFooterComponent,
    TimeParsePipe,
    ReadParsePipe,
    BugReportComponent,
    PrivacyComponent,
    TermsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    SlickCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgxTextOverflowClampModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
