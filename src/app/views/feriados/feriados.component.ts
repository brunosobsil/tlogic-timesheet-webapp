import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Feriado } from '../../interfaces/feriado-interface';
import { FeriadoService } from '../../services/feriado-service';
import { ConfirmComponent } from '../notifications/confirm.component';
import { ModalsComponent } from '../notifications/modals.component';
import * as moment from 'moment';

@Component({
  selector: 'app-feriados',
  templateUrl: './feriados.component.html',
  styleUrls: ['./feriados.component.scss']
})
export class FeriadosComponent implements OnInit {

  listaFeriados: Feriado[];
  listaFeriadosFull: Feriado[];
  formGroup: FormGroup;
  isEditing: boolean = false;

  constructor(private feriadoSvc: FeriadoService, private modal: ModalsComponent, private confirm: ConfirmComponent) {
    this.formGroup = new FormGroup({
      data: new FormControl(null, Validators.required),
      descricao: new FormControl('', Validators.required)
    });
  }

  async ngOnInit() {
    this.listaFeriados =  await (await this.feriadoSvc.getFeriados()).toPromise();
    this.listaFeriadosFull = this.listaFeriados;
  }

  async salvar(){
    if(this.validaForm()){
      
      const fer = {...this.formGroup.value} as Feriado;
      if(!this.isEditing){ // inclusão
      
        await (await this.feriadoSvc.incluirFeriado(fer))
        .subscribe(async () => {
          await this.reload();
          this.reset();
        },async (error: HttpErrorResponse) => {

              //this.loading = false;
              if(error.status === 401){
                this.modal.open('Atenção','Acesso negado!');
                // todo redirecionar para login ou refresh no token
              }else if(error.status === 0){
                this.modal.open('Atenção','Não foi possível conectar com o servidor. Verifique sua conexão com a internet!');
              }else if(error.status === 409){
                this.modal.open('Atenção', error.error.error[0]);
              }
              else{
                this.modal.open('Atenção','Erro desconhecido. Tente novamente mais tarde.');
              }
        });
      }else{ // alteração

        await (await this.feriadoSvc.alterarFeriado(fer))
        .subscribe(async () => {
          await this.reload();
          this.reset();
        },async (error: HttpErrorResponse) => {

              //this.loading = false;
              if(error.status === 401){
                this.modal.open('Atenção','Acesso negado!');
                // todo redirecionar para login ou refresh no token
              }else if(error.status === 0){
                this.modal.open('Atenção','Não foi possível conectar com o servidor. Verifique sua conexão com a internet!');
              }else if(error.status === 409){
                this.modal.open('Atenção', error.error.error[0]);
              }
              else{
                this.modal.open('Atenção','Erro desconhecido. Tente novamente mais tarde.');
              }
        });

      }
    }
  }

  validaForm(): boolean{

    let valido = true;

    if(!this.formGroup.value.data){
      this.modal.open('Atenção!','Data é obrigatória!');
      valido = false;
    }else if(!this.formGroup.value.descricao){
      this.modal.open('Atenção!','Descrição é obrigatória!');
      valido = false;
    }

    return valido; 

  }

  editar(feriado: Feriado){
    this.isEditing = true;
    this.formGroup.setValue({...feriado});
  }

  reset(){
    this.formGroup.reset();
    this.isEditing = false;
  }

  async reload(){
    this.listaFeriados =  await (await this.feriadoSvc.getFeriados()).toPromise();
    this.listaFeriadosFull = this.listaFeriados;
  }

  excluir(feriado: Feriado){
    const data = moment(feriado.data);
    const mensagem = `Confirma a exclusão do feriado: "${data.format('DD/MM/YYYY')} - ${feriado.descricao}" ?` 
    this.confirm.open('Atenção!', mensagem, async () => {
      
      await (await this.feriadoSvc.excluirFeriado(feriado))
        .subscribe(async () => {
          await this.reload();
          this.reset();
        },async (error: HttpErrorResponse) => {

              //this.loading = false;
              if(error.status === 401){
                this.modal.open('Atenção','Acesso negado!');
                // todo redirecionar para login ou refresh no token
              }else if(error.status === 0){
                this.modal.open('Atenção','Não foi possível conectar com o servidor. Verifique sua conexão com a internet!');
              }else if(error.status === 409){
                this.modal.open('Atenção', error.error.error[0]);
              }
              else{
                this.modal.open('Atenção','Erro desconhecido. Tente novamente mais tarde.');
              }
        });
    });
  }

  pesquisar(texto :string){
    if(texto.length >= 3){
      // Filtra por data
      if(texto.indexOf('/') > 0 && texto.length == 10){ 
        
        let dataConv = this.convertDateString(1, texto);
          
        if(!isNaN(Date.parse(dataConv))){ // Valida data
          
          const dataFiltro = new Date(dataConv);
          
          this.listaFeriados = this.listaFeriadosFull.filter(f => {
            
            let dt = f.data as any as string;
            dt = dt.replaceAll('-','/');

            const dt1 = new Date(dt);
            const dt2 = dataFiltro;
            
            return dt1.getTime() === dt2.getTime();
          });
          
        }
      }else{
        this.listaFeriados = this.listaFeriadosFull.filter((f) => {
          return f.descricao.toLowerCase() === texto.toLowerCase() || f.descricao.toLowerCase().substr(0,3) === texto.toLowerCase().substr(0,3)
        });
      }
    }else{
      this.listaFeriados = this.listaFeriadosFull;
    }
  }

  /* 
    1 - Converte dd/mm/yyyy para yyyy/mm/dd
    2 - Converte yyyy-mm-dd para yyyy/mm/dd
  */
  convertDateString(opcao, string){
    if(opcao === 1)
      return string.substr(6,4) + '/' + string.substr(3,2) + '/' + string.substr(0,2);
    else
      return string.replace('-','/');
  }

}
