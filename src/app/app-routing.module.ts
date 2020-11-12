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
import { BlogEditComponent } from './components/blog/blog-edit/blog-edit.component';

import * as firebase from 'firebase';
import 'firebase/analytics'
import "firebase/auth";


import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebaseConfig);
firebase.analytics();

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-events', component: BlogComponent },
  { path: 'blog-podcasts', component: BlogComponent },
  { path: 'about', component: AboutComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'programs', component: ProgramsComponent },
  { path: 'blog/:id', component: PostComponent },
  { path: 'blog/:type/:id/edit', component: BlogEditComponent },
  { path: 'login', component: UserComponent },
  { path: 'login/:section', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
