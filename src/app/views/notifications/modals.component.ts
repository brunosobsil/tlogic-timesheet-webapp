import { Component, Injectable, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header bg-primary">
      <h4 class="modal-title">{{titulo}}</h4>
    </div>
    <div class="modal-body" ngbAutofocus>
      <p>{{mensagem}}</p>
    </div>
    <div class="modal-footer" style="border: none">
      <button type="button" class="btn btn-primary" (click)="activeModal.close('Close click')">OK</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() titulo: string;
  @Input() mensagem: string;

  constructor(public activeModal: NgbActiveModal) {}
}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'modals-component',
  templateUrl: './modals.component.html'
})
export class ModalsComponent{
  constructor(private modalService: NgbModal) {}

  open(titulo: string, mensagem: string) {
    const modalRef = this.modalService.open(NgbdModalContent, {centered: true, backdrop: 'static', keyboard: false});
    modalRef.componentInstance.titulo = titulo;
    modalRef.componentInstance.mensagem = mensagem;
  }
}