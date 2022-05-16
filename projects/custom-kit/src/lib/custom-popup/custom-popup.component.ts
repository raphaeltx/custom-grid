import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomPopupService } from './custom-popup.service';



@Component({
  selector: 'vst-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.scss']
})
export class CustomPopupComponent implements OnInit {

  @Input() id: string;
  @Input() width: number;
  @Input() closeOnOutsideClick: boolean = true;
  @Input() backgroundColor: string = '#fff';
  @Input() hideBackground: boolean = true;
  @Input() customPopupClass: string;
  @Input() title: string;
  @Input() showCloseButton: boolean = true;
  @Input() showTitle: boolean = true;
  @Output() onClosing: EventEmitter<any> = new EventEmitter<any>();
  private element: any;
  visible: boolean = false;

  constructor(private service: CustomPopupService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    // garante que o atributo id existe
    if (!this.id) throw new Error('Popup deve ter um Id');

    // move o elemento para o bottom da página (antes do </body>)
    document.body.appendChild(this.element);

    // fecha popup on background click
    if (this.closeOnOutsideClick) {
      this.element.addEventListener('click', el => {
        if (el.target.className === 'vst-custom-popup') {
          this.close();
        }
      });
    }

    // adiciona a popup ao service
    this.service.add(this);
  }

  // remove a popup quando o componente é destruído
  ngOnDestroy(): void {
    this.service.remove(this.id);
    this.element.remove();
  }

  // abre popup
  open(): void {
    this.visible = true;
    document.body.classList.add('vst-custom-popup-open');
  }

  // fecha popup
  close(): void {
    this.onClosing.emit(null);
    this.visible = false;
    document.body.classList.remove('vst-custom-popup-open');
  }

  onClose() {
    this.close();
  }
}