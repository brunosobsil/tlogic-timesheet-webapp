import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeriadoService } from '../../services/feriado-service';
import { ConfirmComponent } from '../notifications/confirm.component';
import { ModalsComponent } from '../notifications/modals.component';

@Component({
  selector: 'app-importar-feriados',
  templateUrl: './importar-feriados.component.html',
  styleUrls: ['./importar-feriados.component.scss']
})
export class ImportarFeriadosComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private feriadoSvc: FeriadoService, private modal: ModalsComponent, private confirm: ConfirmComponent) { 
    this.formGroup = new FormGroup({
      ano: new FormControl(new Date().getFullYear(),Validators.required)
    })
  }

  ngOnInit(): void {
  }

  async importar(){
    let ano = this.formGroup.get('ano').value;
    let feriados = await this.feriadoSvc.getFeriadosCalendarioAPI(ano, false);
    const mensagem = `Confirma a importação de todos os feriados de ${ano} ?`;
    this.confirm.open('Atenção!', mensagem, async () => {
      
      await (await this.feriadoSvc.incluirFeriados(feriados))
        .subscribe(async () => {
          this.modal.open('Atenção!', 'Feriados importados com sucesso!');
        },async (error: HttpErrorResponse) => {

              console.log(error);

              //this.loading = false;
              if(error.status === 401){
                this.modal.open('Atenção','Acesso negado!');
                // todo redirecionar para login ou refresh no token
              }else if(error.status === 0){
                this.modal.open('Atenção','Não foi possível conectar com o servidor. Verifique sua conexão com a internet!');
              }else if(error.status === 409){
                this.modal.open('Atenção', 'Não foi possível importar os feriados. Verifique se os feriados já existem.');
              }
              else{
                this.modal.open('Atenção','Erro desconhecido. Tente novamente mais tarde.');
              }
        });
    });
    
  }

}
