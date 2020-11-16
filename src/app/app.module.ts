import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxTextOverflowClampModule } from "ngx-text-overflow-clamp";
import { HttpClientModule } from "@angular/common/http";

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CountComponent } from './components/count/count.component';


@NgModule({
  declarations: [
    AppComponent,
    CountComponent,
  ],
  imports: [
    BrowserModule,
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
