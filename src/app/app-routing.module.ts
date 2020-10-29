import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { BlogComponent } from './components/blog/blog.component';
import { AboutComponent } from './components/about/about.component';
import { ForumComponent } from './components/forum/forum.component';
import { PostComponent } from './components/blog/post/post.component';

import firebase from 'firebase/app'
import 'firebase/analytics'
// import firebase from 'firebase/analytics'


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
  { path: 'blog/:id/:time/:title', component: PostComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
