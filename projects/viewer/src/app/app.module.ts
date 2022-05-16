import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomGridModule, CustomPopupModule } from 'projects/custom-kit/src/public-api';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    CustomGridModule,
    CustomPopupModule,
    HttpClientModule,
    NgxMaskModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [
    DatePipe
  ]
})
export class AppModule { }
