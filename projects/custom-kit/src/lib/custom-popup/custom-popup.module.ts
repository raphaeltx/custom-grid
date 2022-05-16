import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPopupComponent } from './custom-popup.component';



@NgModule({
  declarations: [CustomPopupComponent],
  imports: [
    CommonModule
  ],
  exports: [CustomPopupComponent]
})
export class CustomPopupModule { }
