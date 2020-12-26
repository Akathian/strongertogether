import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

import { ProgramsComponent } from './components/programs/programs.component';
import { BlogComponent } from './components/blog/blog.component';
import { AboutComponent } from './components/about/about.component';
import { ForumComponent } from './components/forum/forum.component';
import { UserComponent } from './components/user/user.component';
import { PostComponent } from './components/blog/post/post.component';
import { BlogEditComponent } from './components/blog/blog-edit/blog-edit.component';
import { BugReportComponent } from './components/bug-report/bug-report.component';
import { PrivacyComponent } from './components/legal/privacy/privacy.component';
import { TermsComponent } from './components/legal/terms/terms.component';
import { ForumEditComponent } from './components/forum/forum-edit/forum-edit.component';
import { ForumPostComponent } from './components/forum/forum-post/forum-post.component';
import * as firebase from 'firebase';
import 'firebase/analytics'
import "firebase/auth";


import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebaseConfig);
firebase.analytics();

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-events', component: BlogComponent },
  { path: 'blog-podcasts', component: BlogComponent },
  { path: 'about', component: AboutComponent },
  { path: 'community', component: ForumComponent },
  { path: 'community/:id', component: ForumPostComponent },
  { path: 'community/:type/:id/edit', component: ForumEditComponent },
  { path: 'services', component: ProgramsComponent },
  { path: 'blog/:id', component: PostComponent },
  { path: 'blog/:type/:id/edit', component: BlogEditComponent },
  { path: 'login', component: UserComponent },
  { path: 'user/:uid/:section', component: UserComponent },
  { path: 'bug-report', component: BugReportComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
