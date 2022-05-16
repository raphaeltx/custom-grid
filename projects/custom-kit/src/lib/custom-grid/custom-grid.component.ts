import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { CustomPopupService } from '../custom-popup/custom-popup.service';
import { ExcelExportService } from '../util/excel-export.service';
import { isEmptyOrSpaces, ApplyCustomMask, GridCellValue, CurrencyConvert, SetValueDataField } from '../util/util';
import { CustomGridColumnComponent, VSTCustomGRIDColumnType } from './components/custom-grid-column/custom-grid-column.component';
import { CommandGridOptions, CustomDataSource, CustomGridButton, CustomGridCommand, LoadDataSourceOptions, PaginationSettings, SearchItem } from './custom-grid.component.model';
import customKitDomain from '../util/custom-kit.domain';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

export type GridEvent = 'grid' | 'update' | 'view' | 'insert';
export type GridEditMode = 'cell' | 'custom';

//TODO: ajustar máscaras dos inputs nas células. Ajustar validação dos inputs nas células.



@Component({
  selector: 'vst-custom-grid',
  templateUrl: './custom-grid.component.html',
  styleUrls: ['./custom-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomGridComponent implements OnInit, AfterViewInit {

  @ContentChildren(CustomGridColumnComponent) columnComponents: QueryList<CustomGridColumnComponent>;
  @Input() allowInserting: boolean = false;
  @Input() allowUpdating: boolean = false;
  @Input() allowDeleting: boolean = false;
  @Input() allowViewing: boolean = false;
  @Input() allowExporting: boolean = false;
  @Input() gridEditMode: GridEditMode = 'custom';
  @Input() keyExpr: string;
  @Input() dataSource: CustomDataSource;
  @Output() onInserting: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdating: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleting: EventEmitter<any> = new EventEmitter<any>();
  @Output() onViewing: EventEmitter<any> = new EventEmitter<any>();
  @Input() showTotalFooter: boolean = false;
  @Input() showPagination: boolean = true;
  @Input() exportFileName: '';
  @Input() commandGridOptions: CommandGridOptions = {};
  @Output() onExporting: EventEmitter<any> = new EventEmitter<any>();
  @Input() allowCollapseRow: boolean = false;
  @Input() allowSearch: boolean = false;
  @Input() allowCustomCommand: boolean = false;
  @Input() customGridButtonList: Array<CustomGridButton> = [];
  @Input() customGridCommandList: Array<CustomGridCommand> = [];
  @Input() paginationByPage: boolean = false;
  public gridEvent: GridEvent = 'grid';
  columns: Array<CustomGridColumnComponent> = [];
  customKitDomain: any = customKitDomain;
  dataSourceList: any[] = [];
  showConfirmaDialog: boolean;
  selectedKey: any;
  // options da paginação
  loadDataSourceOptions: LoadDataSourceOptions = {
    totalRows: 0,
    skip: 0,
    take: 5,
    pageNumber: 1,
    searchBody: null
  };
  paginationSettings: PaginationSettings = {
    paginationItems: [],
    mainPaginationItems: [],
    totalPages: 0,
    showLastPage: false,
    showFirstPage: false,
    lastPageNumber: 0
  }
  _activePageIndex: number = 1;
  _activePageIndexAux: number = 1;
  onEditCellMode: boolean = false;
  totalFooterList: Array<{ sum: number, dataField: string, showRightBorder: boolean, showLeftBorder: boolean, showTotalFooterValue: boolean, columnType: VSTCustomGRIDColumnType }>;
  rowSelected: number = null;
  colSelected: number = null;
  searchString: string = "";
  searchColumnsList: Array<SearchItem> = new Array<SearchItem>();
  searchColumnChooserForm: FormGroup;
  searchSelectedColumns: Array<string> = new Array<string>();

  constructor(
    private vxhbPopupService: CustomPopupService,
    private dc: ChangeDetectorRef,
    private excelExportService: ExcelExportService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    if (!this.keyExpr || this.keyExpr === null || this.keyExpr === '') throw new Error('Key Expr deve ser definido');
    if (this.showTotalFooter) this.totalFooterList = new Array<{ sum: number, dataField: string, showRightBorder: boolean, showLeftBorder: boolean, showTotalFooterValue: boolean, columnType: VSTCustomGRIDColumnType }>();
  }

  ngAfterViewInit() {
    this.columns = this.columnComponents['_results'];

    if (this.allowSearch) this.prepareSearchColumnsList();

    this.load();
  }

  preparePaginationSettings() {
    let numOfPages = this.loadDataSourceOptions.totalRows < this.loadDataSourceOptions.take ? 1 : this.loadDataSourceOptions.totalRows / this.loadDataSourceOptions.take;

    numOfPages = Math.ceil(numOfPages);

    this.paginationSettings.mainPaginationItems = [];

    for (let i = 1; i <= numOfPages; i++) {
      this.paginationSettings.mainPaginationItems.push(i);
    }

    if (numOfPages > 5) {
      this.paginationSettings.lastPageNumber = numOfPages;

      if (this._activePageIndexAux <= 4) {
        this.paginationSettings.showFirstPage = false;
        this.paginationSettings.showLastPage = true;
        this.paginationSettings.paginationItems = this.paginationSettings.mainPaginationItems.slice(0, 5);
      } else if (this._activePageIndexAux >= 4 && this._activePageIndexAux < numOfPages - 3) {
        this.paginationSettings.paginationItems = this.paginationSettings.mainPaginationItems.slice(this._activePageIndexAux - 3, this._activePageIndexAux + 1);
        this.paginationSettings.showFirstPage = true;
        this.paginationSettings.showLastPage = true;
      } else {
        this.paginationSettings.paginationItems = this.paginationSettings.mainPaginationItems.slice(numOfPages - 5, numOfPages);
        this.paginationSettings.showLastPage = false;
        this.paginationSettings.showFirstPage = true;
      }
    } else {
      this.paginationSettings.showFirstPage = false;
      this.paginationSettings.showLastPage = false;

      this.paginationSettings.paginationItems = this.paginationSettings.mainPaginationItems;
    }

    this._activePageIndex = this._activePageIndexAux;
    this.onEditCellMode = false;
    this.rowSelected = null;
    this.colSelected = null;
  }

  prepareSearchColumnsList() {
    this.columns.forEach(el => {
      if (el.allowSearch) this.searchColumnsList.push({ caption: el.caption, dataField: el.dataField, value: false });
    });

    this.searchColumnChooserForm = this.formBuilder.group({
      columns: new FormArray([])
    });

    this.searchColumnsList.forEach(() => this.searchColumnChooserFormArray.push(new FormControl(true)));

    this.getSearchSelectedColumns();
  }

  get searchColumnChooserFormArray() {
    return this.searchColumnChooserForm.controls.columns as FormArray;
  }

  // MÉTODOS DO DATASOURCE (CRUD)
  insert(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dataSource.insert(data).then(res => {
        this.load();

        resolve(true);
      });
    });
  }

  update(key: any, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dataSource.update(key, data).then(res => {
        this.load(false);

        if (this.gridEditMode == 'cell') {
          this.onEditCellMode = false;
          this.rowSelected = null;
          this.colSelected = null;
        }

        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  remove(key: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dataSource.remove(key).then(res => {
        this.vxhbPopupService.close('popup-grid-del-confirm');

        this.load();
      });
    });
  }

  load(preparePaginationSettings: boolean = true): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dataSource.load(this.loadDataSourceOptions).then(res => {
        this.dataSourceList = [];
        let totalCount = 0;

        if (res['data']) {
          this.dataSourceList = res['data'];
          totalCount = res['totalCount'];
        } else {
          this.dataSourceList = (res as any[]);
          totalCount = this.dataSourceList.length;
        }

        // prepara a linha de total
        if (this.showTotalFooter) {
          this.totalFooterList = [];

          this.dataSourceList.forEach(val => {
            this.columns.forEach((el, i) => {
              if (el.showTotalFooterValue) {
                if (!this.totalFooterList[i]) {
                  this.totalFooterList[i] = {
                    sum: val[el.dataField],
                    dataField: el.dataField,
                    showRightBorder: el.showRightBorder,
                    showLeftBorder: el.showLeftBorder,
                    showTotalFooterValue: el.showTotalFooterValue,
                    columnType: el.columnType
                  };
                } else {
                  let value: number = this.totalFooterList[i].sum + val[el.dataField];

                  this.totalFooterList[i].sum = Number(value.toFixed(2));
                }
              }
            });
          });
        }

        this.loadDataSourceOptions.totalRows = totalCount;

        if (preparePaginationSettings && this.showPagination) this.preparePaginationSettings();

        this.gridEvent = 'grid';
        this.dc.detectChanges();
      });
    });
  }

  byKey(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dataSource.byKey(this.selectedKey).then(res => {
        resolve(res);
      });
    });
  }

  // MÉTODOS DOS BOTÕES DO CRUD
  add(event) {
    this.gridEvent = 'insert';
    this.onInserting.emit();
  }

  del(event) {
    this.selectedKey = event[this.keyExpr];
    this.vxhbPopupService.open('popup-grid-del-confirm');
    this.onDeleting.emit(event);
  }

  upd(event, index, colIndex) {
    if (this.gridEditMode == 'cell') {
      this.onEditCellMode = true;
      this.rowSelected = index;
      this.colSelected = colIndex;

      this.load();
    } else {
      this.gridEvent = 'update';
      this.selectedKey = event[this.keyExpr];
      this.onUpdating.emit(event);
    }
  }

  view(event) {
    this.gridEvent = 'view';
    this.selectedKey = event[this.keyExpr];
    this.onViewing.emit(event);
  }

  // MÉTODOS DA DELEÇÃO
  cancelDeleteRow() {
    this.vxhbPopupService.close('popup-grid-del-confirm');
  }

  confirmDeleteRow() {
    this.remove(this.selectedKey);
  }

  // NAVEGAÇÃO
  navigatePagination(pageNumber: number) {
    this._activePageIndexAux = pageNumber;

    if (this.paginationByPage) {
      this.loadDataSourceOptions.pageNumber = pageNumber;
    } else {
      // configuração do skip
      if (pageNumber === 1) {
        this.loadDataSourceOptions.skip = 0;
      } else if (pageNumber === 2) {
        this.loadDataSourceOptions.skip = this.loadDataSourceOptions.take;
      } else {
        this.loadDataSourceOptions.skip = (pageNumber - 1) * this.loadDataSourceOptions.take;
      }
    }

    this.load();
  }

  onPageSizeChanged(event) {
    this.loadDataSourceOptions.take = event;

    this.load();
  }

  setDataSource(dataSource: CustomDataSource, resetPagination: boolean = false) {
    this.dataSource = dataSource;

    if (this.gridEditMode == 'cell') this.onEditCellMode = false;

    if (resetPagination) {
      this.loadDataSourceOptions.skip = 0;
      this.loadDataSourceOptions.pageNumber = 1;
      this._activePageIndex = 1;
    }

    this.load();
  }

  exportExcel(event: { cancelExportEvent: boolean } = { cancelExportEvent: false }) {
    this.onExporting.emit(event);

    if (!event.cancelExportEvent) this.dataSource.load({ skip: null, take: null }).then((res: any[]) => {
      const list = res['data'] ? res['data'] : res;

      this.exportAsExcelFile(list);
    });
  }

  exportAsExcelFile(list: any[]) {
    let data: Array<any> = new Array<any>();

    list.forEach(el => {
      let obj = {};

      Object.getOwnPropertyNames(el).forEach(name => {
        this.columns.forEach(col => {
          if (name == col.dataField) {
            if (col.columnType === 'domain') obj[col.caption] = GridCellValue(el, col.dataField, col.lookup);
            else if (col.columnType === 'text') {
              if (isEmptyOrSpaces(col.mask)) obj[col.caption] = el[name];
              else obj[col.caption] = ApplyCustomMask(el[name], col.mask);
            } else if (col.columnType === 'currency') obj[col.caption] = CurrencyConvert(el[name]);
            else if (col.columnType === 'date') obj[col.caption] = this.datePipe.transform(el[name], col.dateFormat);
          }
        });
      });

      data.push(obj);
    });

    this.excelExportService.exportAsExcelFile(data, this.exportFileName);
  }

  save = (item: any, rowIndex: number) => {
    let isValid = this.validateCellInputs(rowIndex);

    if (isValid) this.update(item[this.keyExpr], item);
  }

  teste(event, rowIndex: number) {
    let value: any = event.target.value;
    let className: string = event.target.className;
    let hasErrorClass: boolean = className.includes('is-invalid');
    let isInvalid: boolean = isEmptyOrSpaces(value);

    if (!isInvalid && hasErrorClass) event.target.className = `form-control form-control-sm cellInput${rowIndex}`;
  }

  validateCellInputs(rowIndex: number): boolean {
    let inputListLength = document.getElementsByClassName(`cellInput${rowIndex}`).length;
    let isValid: boolean = true;

    for (let i = 0; i < inputListLength; i++) {
      let element = document.getElementsByClassName(`cellInput${rowIndex}`)[i];
      //@ts-ignore
      let elementValue = element.value;

      if (isEmptyOrSpaces(elementValue)) {
        if (isValid) isValid = false;

        element.className = `is-invalid form-control form-control-sm cellInput${rowIndex}`;
      } else element.className = `form-control form-control-sm cellInput${rowIndex}`;
    }

    return isValid;
  }

  cellModelCange(event: any, item: any, dataField: string) {
    SetValueDataField(item, dataField, event);
  }

  cancel() {
    this.onEditCellMode = false;
    this.rowSelected = null;
    this.colSelected = null;

    this.load();
  }

  search() {
    this.loadDataSourceOptions.searchBody = { searchString: this.searchString, selectors: [] };

    this._activePageIndexAux = 1;
    this.loadDataSourceOptions.pageNumber = 1;

    this.searchSelectedColumns.forEach(el => {
      this.loadDataSourceOptions.searchBody.selectors.push(el);
    });

    this.load();
  }

  searchSettings() {
    this.vxhbPopupService.open('popup-grid-search-settings');
  }

  saveSettings() {
    this.getSearchSelectedColumns();

    this.vxhbPopupService.close('popup-grid-search-settings');
  }

  getSearchSelectedColumns() {
    this.searchSelectedColumns = this.searchColumnChooserForm.value.columns
      .map((checked, i) => checked ? this.searchColumnsList[i].dataField : null)
      .filter(v => v !== null);
  }
}