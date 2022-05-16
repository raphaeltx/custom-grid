import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { LookupOptions } from './custom-grid/components/custom-grid-column/custom-grid-column.models';
import { GridCellValue } from './util/util';

@Pipe({ name: 'domainGridCellValue' })
export class DomainGridCellValuePipe implements PipeTransform {
  transform(obj: any, dataField: string, lookupOptions: LookupOptions) {

    return GridCellValue(obj, dataField, lookupOptions);
  }
}



@NgModule({
  declarations: [DomainGridCellValuePipe],
  exports: [DomainGridCellValuePipe]
})
export class DomainGridCellValuePipeModule { }
