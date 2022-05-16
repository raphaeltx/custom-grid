
import { LookupOptions, VSTCustomGRIDColumnType } from "../custom-grid/custom-grid.api";



// verifica se string undefined, nula ou vazia
export function isEmptyOrSpaces(str: string) {
    if (str === undefined || str === null || str === 'undefined')
        return true;

    return str.match(/^ *$/) !== null;
}

// função para aplicar máscaras
export function ApplyCustomMask(value: string, mask: string): string {
    let maskedValue = mask;
    let valueChartCount = 0;

    if (!IsZeroPatternMaskValid(mask, value)) throw new Error('Máscara inválida! Dígitos obrigatórios não estão sendo preenchidos.');

    for (let i = 0; i < mask.length; i++) {
        const maskChar = mask.charAt(i);
        const maskedChar = value.charAt(valueChartCount);

        if ((maskChar === '0' || maskChar == '9') && !isNaN(Number(maskedChar))) {
            maskedValue = replaceAt(maskedValue, i, maskedChar);

            valueChartCount++;
        }
    }

    // TODO: aplicar máscara

    return maskedValue;
}

export function IsZeroPatternMaskValid(mask: string, value: string): boolean {
    let lastZeroCharIndex = 0;
    let isValid = true;
    let numbersStr = mask.replace(/\D/g, "");

    for (let i = numbersStr.length - 1; i >= 0; i--) {
        if (numbersStr.charAt(i) == '0') {
            lastZeroCharIndex = i;
            isValid = lastZeroCharIndex + 1 <= value.length;

            break;
        }
    }

    return isValid;
}

export function replaceAt(string, index, replace) {
    return string.substring(0, index) + replace + string.substring(index + 1);
}

export function GridCellValue(obj: any, dataField: string, lookupOptions: LookupOptions): string {
    let output = '';
    const value = obj[dataField];

    if (value && lookupOptions) output = lookupOptions.dataSource.find(v => v[lookupOptions.valueExpr] == value)[lookupOptions.displayExpr];

    return output;
}

// função conversão de moeda
export function CurrencyConvert(value: string | number, withRS: boolean = true) {
    if (isEmptyOrSpaces(String(value))) value = 0;

    if (withRS) value = Number(value).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    else value = Number(value).toLocaleString('pt-br', { minimumFractionDigits: 2 });;

    return value;
}

export function GetValueDataField(obj: any, dataField: string): any {
    let path = dataField.split('.');

    if (path.length > 1) {
        let context = obj;

        for (var i = 0; i < path.length; i++) context = context[path[i]];

        return context;
    } else return obj[dataField];
}

export function SetValueDataField(obj: object, dataField: string, value?: any): any {
    const path = dataField.split('.');
    const auxField = path.shift();

    if (path.length === 0) {
        if (value !== undefined) obj[auxField] = value;
        return obj[auxField];
    }

    if (typeof obj[auxField] !== "object") obj[auxField] = {};

    return SetValueDataField(obj[auxField], path.join("."), value);
}