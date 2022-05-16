import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { VSTCustomGRIDColumnType } from './custom-grid/custom-grid.api';
import { GetValueDataField } from './util/util';

@Pipe({ name: 'gridCellValue' })
export class GridCellValuePipe implements PipeTransform {
  transform(obj: any, dataField: string) {
    return GetValueDataField(obj, dataField);
  }
}



@NgModule({
  declarations: [GridCellValuePipe],
  exports: [GridCellValuePipe]
})
export class GridCellValuePipeModule { }
