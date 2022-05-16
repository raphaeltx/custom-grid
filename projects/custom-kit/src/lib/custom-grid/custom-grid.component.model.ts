export class CustomDataSource {
    byKey?: ((key: any | string | number) => Promise<any>);
    load?: ((options?: LoadDataSourceOptions) => Promise<any[] | { data: any[], totalCount: number }>);
    insert?: ((values: any) => Promise<any>);
    update?: ((key: any | string | number, values: any) => Promise<any>);
    remove?: ((key: any | string | number) => Promise<void>);
}

export interface CommandGridOptions {
    insertCommandClass?: string;
    updateCommandClass?: string;
    deleteCommandClass?: string;
    viewCommandClass?: string;
    cancelCommandClass?: string;
    saveCommandClass?: string;
    exportCommandClass?: string;
    viewCommandTitle?: string;
}

export interface LoadDataSourceOptions {
    skip?: number;
    take?: number;
    pageNumber?: number;
    totalRows?: number;
    searchBody?: SearchBody;
}

export interface SearchBody {
    selectors: Array<string>;
    searchString: string;
}

export interface SearchItem {
    caption: string;
    dataField: string;
    value: boolean;
}

export interface CustomGridButton {
    callback: (() => any);
    iconClass?: string;
    label?: string;
    buttonClass?: string;
}

export interface CustomGridCommand {
    callback: (() => any);
    iconClass?: string;
    title?: string;
}

export interface PaginationSettings {
    paginationItems: Array<number>;
    mainPaginationItems: Array<number>;
    totalPages: number;
    showLastPage: boolean;
    showFirstPage: boolean;
    lastPageNumber: number;
}