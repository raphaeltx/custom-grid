import { CommonModule, registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { CurrencyConvertModule } from '../currency-convert.module';
import { CustomPopupModule } from '../custom-popup/custom-popup.module';
import { DomainGridCellValuePipeModule } from '../domain-grid-cell-value.module';
import { GridCellValuePipeModule } from '../grid-cell-value-pipe.module';
import { CustomGridColumnComponent } from './components/custom-grid-column/custom-grid-column.component';
import { CustomGridComponent } from './custom-grid.component';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr)



@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    CustomPopupModule,
    GridCellValuePipeModule,
    DomainGridCellValuePipeModule,
    CurrencyConvertModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule
  ],
  declarations: [CustomGridComponent, CustomGridColumnComponent],
  exports: [CustomGridComponent, CustomGridColumnComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
  ]
})
export class CustomGridModule { }
