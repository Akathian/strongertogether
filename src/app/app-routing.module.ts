import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as firebase from 'firebase';
import 'firebase/analytics'
import "firebase/auth";


import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebaseConfig);
firebase.analytics();

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
