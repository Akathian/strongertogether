import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BlogComponent } from './components/blog/blog.component';
import { ResourcesComponent } from './components/resources/resources.component';
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
// import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BlogComponent,
    ResourcesComponent,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlickCarouselModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
