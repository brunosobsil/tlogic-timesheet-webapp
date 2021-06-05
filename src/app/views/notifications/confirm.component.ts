import { Component, Injectable, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-confirm-content',
  template: `
    <div class="modal-header bg-primary">
      <h4 class="modal-title">{{titulo}}</h4>
    </div>
    <div class="modal-body" ngbAutofocus>
      <p>{{mensagem}}</p>
    </div>
    <div class="modal-footer" style="border: none">
      <button type="button" class="btn btn-primary" (click)="this.confirm(); activeModal.close('Close click')" style="margin-right: 10px; min-width: 80px;">Confirmar</button>
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('Close click')" style="min-width: 80px;">Cancelar</button>
    </div>
  `
})
export class NgbConfirmContent {
  @Input() titulo: string;
  @Input() mensagem: string;
  @Input() confirm: () => void;

  constructor(public activeModal: NgbActiveModal) {}
}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'confirm-component',
  templateUrl: './confirm.component.html'
})

export class ConfirmComponent{

  constructor(private modalService: NgbModal) {}

  open(titulo: string, mensagem: string, confirm: () => void) {
    const modalRef = this.modalService.open(NgbConfirmContent, {centered: true, backdrop: 'static', keyboard: false});
    modalRef.componentInstance.titulo = titulo;
    modalRef.componentInstance.mensagem = mensagem;
    modalRef.componentInstance.confirm = confirm;
  }
}