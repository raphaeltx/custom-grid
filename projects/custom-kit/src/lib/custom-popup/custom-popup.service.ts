import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomPopupService {

  private popups: any[] = [];

  constructor() { }

  add(popup: any) {
    // adiciona popup ao array de popups ativas
    this.popups.push(popup);
  }

  remove(id: string) {
    // remove popup do array de popups ativas
    this.popups = this.popups.filter(x => x.id !== id);
  }

  open(id: string) {
    // abre popup específica por id
    const popup = this.popups.find(x => x.id === id);
    popup.open();
  }

  close(id: string) {
    // fecha específica por id
    const popup = this.popups.find(x => x.id === id);
    popup.close();
  }
}
