import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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

import { SlickCarouselModule } from 'ngx-slick-carousel';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlickCarouselModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
