import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ResourcesComponent } from './components/resources/resources.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'resources', component: ResourcesComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
