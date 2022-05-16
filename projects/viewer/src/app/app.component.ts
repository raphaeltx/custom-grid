import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommandGridOptions, CustomDataSource, CustomGridButton } from 'projects/custom-kit/src/lib/custom-grid/custom-grid.component.model';
import { CustomPopupService } from 'projects/custom-kit/src/lib/custom-popup/custom-popup.service';
import { map } from "rxjs/operators";

export interface CNAE {
  atividadeComercial: string;
  codigoCnae: string;
  dataInclusao: string;
  descricao: string;
  id: number;
  mcc: string;
  pacotes: Array<any>;
}

export interface PacoteTipo {
  descricao: string;
  id: number;
  dataInclusao: string
}



@Component({
  selector: 'app-root',
  template: `
    <button class="btn btn-primary m-5" (click)="open()">Abrir popup</button>

    <vst-custom-popup id="teste-popup" [width]="700" title="Testando" [showTitle]="true" [closeOnOutsideClick]="false">
      TESTE
    </vst-custom-popup>

    <div class="m-4">
      <vst-custom-grid [dataSource]="dataSource" [allowSearch]="true" [paginationByPage]="true"
      [allowCollapseRow]="false" [showTotalFooter]="false" [allowInserting]="false" [allowDeleting]="false" [allowUpdating]="true"
      [allowViewing]="false" [allowExporting]="false"  keyExpr="id" 
      [commandGridOptions]="commandGridOptions" [showPagination]="true" [customGridButtonList]="customButton" gridEditMode="cell">
      <!-- [customGridButtonList]="customButton" -->
      <!-- <vst-custom-grid-column dataField="cnae.descricao" caption="Cnae" columnType="text"></vst-custom-grid-column>
      <vst-custom-grid-column dataField="bandeira.descricao" caption="Bandeira" columnType="text"></vst-custom-grid-column>
      <vst-custom-grid-column dataField="pacoteTipo.descricao" caption="Tipo de pacote" columnType="text"></vst-custom-grid-column> -->

      <!-- <vst-custom-grid-column dataField="descricao" caption="Descrição" [allowEdit]="true" columnType="text">
        </vst-custom-grid-column>
        <vst-custom-grid-column dataField="taxa" caption="Taxa" columnType="percent">
        </vst-custom-grid-column>
    </vst-custom-grid> -->

    <vst-custom-grid-column dataField="nome" caption="Nome" columnType="text">
    </vst-custom-grid-column>
    <vst-custom-grid-column dataField="cpf" caption="Cpf" columnType="text" mask="000.000.000-00">
    </vst-custom-grid-column>
    <vst-custom-grid-column dataField="administrador" caption="Admin" columnType="text" [allowSearch]="false">
    </vst-custom-grid-column>
  `,
  styles: []
})
export class AppComponent {

  dataSource: CustomDataSource = this.dsPacotes();
  commandGridOptions: CommandGridOptions = {
    insertCommandClass: 'far fa-plus',
    updateCommandClass: 'far fa-edit',
    deleteCommandClass: 'far fa-trash-alt',
    exportCommandClass: 'far fa-file-excel',
    cancelCommandClass: 'far fa-times',
    saveCommandClass: 'far fa-save',
    viewCommandClass: 'far fa-eye',
  };
  customButton: Array<CustomGridButton> = [
    {
      callback: () => {
        console.log('chamou')
      },
      iconClass: 'far fa-plus',
      label: 'Alterar taxas em massa',
      buttonClass: 'btn btn-primary btn-sm'
    }
  ]

  constructor(private customPopupService: CustomPopupService, private http: HttpClient) {

  }

  open = () => {
    this.customPopupService.open('teste-popup');
  }

  dsPacotes(): CustomDataSource {
    return {
      byKey: (key) => {
        return new Promise((resolve, reject) => { });
      },
      load: (opt) => {
        return new Promise((resolve, reject) => {
          // this.http.get<PacoteTipo[]>(`/api/Pacotes/${opt.pageNumber}/${opt.take}`).pipe(map(res => {
          //   resolve({ data: res['pacotes'], totalCount: res['quantidadeTotal'] });

          //   return res;
          // })).toPromise();

          // this.http.get<any[]>(`/api/Modalidades/${20}`).pipe(map(res => {
          //   resolve(res);

          //   return res;
          // })).toPromise();

          this.http.get<any[]>(`/api/Users/${opt.pageNumber}/${opt.take}`).pipe(map(res => {


            resolve({ data: res['users'], totalCount: res['quantidadeTotal'] });

            return res;
          })).toPromise();
        });
      },
      remove: (key) => {
        return new Promise((resolve, reject) => { });
      },
      update: (key, values) => {
        return new Promise((resolve, reject) => {

          console.log('key: ', key)
          console.log('values: ', values)

          resolve(null);
        });
      },
      insert: (values) => {
        return new Promise((resolve, reject) => { });
      }
    }
  }
}
