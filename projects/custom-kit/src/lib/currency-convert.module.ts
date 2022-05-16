import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CurrencyConvert } from './util/util';

// pipe conversão de moeda
@Pipe({ name: 'currencyConvertPipe' })
export class CurrencyConvertPipe implements PipeTransform {
    transform(value: string | number, withRS: boolean = true) {
        return CurrencyConvert(value, withRS);
    }
}



@NgModule({
  declarations: [CurrencyConvertPipe],
  exports: [CurrencyConvertPipe]
})
export class CurrencyConvertModule { }
