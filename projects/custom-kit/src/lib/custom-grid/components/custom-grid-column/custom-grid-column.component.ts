import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isEmptyOrSpaces } from '../../../util/util';
import { LookupOptions } from './custom-grid-column.models';

export type VSTCustomGRIDColumnType = 'text' | 'domain' | 'date' | 'command' | 'currency' | 'percent';



@Component({
  selector: 'vst-custom-grid-column',
  templateUrl: './custom-grid-column.component.html',
  styles: []
})
export class CustomGridColumnComponent implements OnInit {

  @Input() caption: string;
  @Input() dataField: string;
  @Input() columnType: VSTCustomGRIDColumnType = 'text';
  @Input() mask: string;
  @Input() lookup: LookupOptions;
  @Input() dateFormat: string;
  @Input() customCommandIconClass: string;
  @Output() onCustomCommandClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() showRightBorder: boolean = false;
  @Input() showLeftBorder: boolean = false;
  @Input() showTotalFooterValue: boolean = false;
  @Input() allowEdit: boolean = true;
  @Input() allowSearch: boolean = true;
  isColumnEditCellValid: boolean = false;

  constructor() { }

  ngOnInit() {
    if (this.columnType === 'command' && isEmptyOrSpaces(this.customCommandIconClass)) throw new Error(`Icon class deve ser definido para colunas do tipo 'command'`);
  }

  customCommandClick(row) {
    this.onCustomCommandClick.emit(row);
  }
}
