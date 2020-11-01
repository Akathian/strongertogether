import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { BlogComponent } from './components/blog/blog.component';
import { AboutComponent } from './components/about/about.component';
import { ForumComponent } from './components/forum/forum.component';
import { UserComponent } from './components/user/user.component';
import { PostComponent } from './components/blog/post/post.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { BookingsComponent } from './components/user/bookings/bookings.component';
import { BlogPostsComponent } from './components/user/blog-posts/blog-posts.component';
import { BlogCommentsComponent } from './components/user/blog-comments/blog-comments.component';
import { BlogLikesComponent } from './components/user/blog-likes/blog-likes.component';
import { DraftsComponent } from './components/user/drafts/drafts.component';
import { ForumCommentsComponent } from './components/user/forum-comments/forum-comments.component';
import { ForumPostsComponent } from './components/user/forum-posts/forum-posts.component';
import firebase from 'firebase/app'
import 'firebase/analytics'
import "firebase/auth";


import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebaseConfig);
firebase.analytics();

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'about', component: AboutComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'programs', component: ProgramsComponent },
  { path: 'blog/:id/:time/:title', component: PostComponent },
  { path: 'login', component: UserComponent },
  { path: 'login/:section', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
