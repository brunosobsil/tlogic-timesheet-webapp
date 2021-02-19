import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalsComponent } from '../notifications/modals.component';
import { UsuarioService } from '../../services/usuario-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExcelService } from '../../services/excel-service';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';

@Component({
  selector: 'app-relatorio-extrato-horas',
  templateUrl: './relatorio-extrato-horas.component.html',
  styleUrls: ['./relatorio-extrato-horas.component.scss']
})
export class RelatorioExtratoHorasComponent implements OnInit {

  public loading:boolean = false;
  public formGroup: FormGroup;

  constructor(private modal: ModalsComponent, 
              private usuarioSvc: UsuarioService,
              private excelSvc: ExcelService) {
    
    this.formGroup = new FormGroup({
      dataDe: new FormControl('', Validators.required),
      dataAte: new FormControl('', Validators.required)
    });
    moment.locale('pt-br');
   }

  ngOnInit(): void {
  }

  async gerarRelatorio(){
    
    if(this.formGroup.valid){
      if(this.formGroup.value.dataDe > this.formGroup.value.dataAte)
        this.modal.open('Atenção!', '"Período de" não pode ser maior que "Período até"!');
      else{
        this.loading = true;
        (await this.usuarioSvc.extratoHorasPeriodo(this.formGroup.value.dataDe, this.formGroup.value.dataAte))
          .subscribe(dados => {
            const dadosTratados = this.trataDados(dados);
            this.excelSvc.gerarPlanilha('Extrato Periodo ' + this.formGroup.value.dataDe + ' a ' + this.formGroup.value.dataAte,
                                        dadosTratados.worksheetNames,
                                        dadosTratados.headers,
                                        dadosTratados.rows);
            this.loading = false;
          },async (error: HttpErrorResponse) => {

            this.loading = false;
            if(error.status === 401){
              this.modal.open('Atenção','Acesso negado!');
              // todo redirecionar para login ou refresh no token
            }else if(error.status === 0){
              this.modal.open('Atenção','Não foi possível conectar com o servidor. Verifique sua conexão com a internet!');
            }else{
              this.modal.open('Atenção','Erro desconhecido. Tente novamente mais tarde.');
            }
          });
        
      }
    }else{
      if(! this.formGroup.value.dataDe || !this.formGroup.value.dataAte)
        this.modal.open('Atenção!', 'Informe os campos: "Período de" e "Período até"!');
    }
  }

  trataDados(dados){
    
    let worksheetNames = [];
    let headers = [];
    let rows = [];
    
    dados.map(d => {
      if(worksheetNames.indexOf(d.nome) < 0){
        worksheetNames.push(d.nome);
      }
    });

    worksheetNames.map(n => {
      
      // filtra os apontamentos do analista
      let fil = dados.filter(d => {
        if(d.nome === n)
          return d;
      });
      
      // obtem o maximo de apontamentos que o analista teve em uma mesma data

      let linha = 0;
      let maximo = 0;
      let data_atual;
      let tot_apontamentos = 0;
      while (linha < fil.length){

        tot_apontamentos = 0;
        data_atual = fil[linha].data;
        while(linha < fil.length && data_atual === fil[linha].data){
          tot_apontamentos++;
          linha++;
        }
        linha--;

        if(tot_apontamentos > maximo){
          maximo = tot_apontamentos;
        }

        linha++;

      }

      /*
      let maximo = 0;
      let data_atual = fil[0].data;
      let tot_apontamentos = 0;
      fil.map(f => {
        
        if(f.data === data_atual){
          tot_apontamentos++;
        }else{
          if(tot_apontamentos > maximo){
            maximo = tot_apontamentos;
          }
          data_atual = f.data;
          tot_apontamentos = 0;
        }
      });

      if(tot_apontamentos > maximo){
        maximo = tot_apontamentos;
        tot_apontamentos = 0;
      }
      */

      // monta o header de forma dinamica, de acordo com o maximo de apontamentos
      let header_analista = ['Dia','Sem'];
      let count = 0;
      for(let h = 0; h < maximo; h++){
        if(h % 2 === 0){
          count++;
          header_analista.push('Entr. ' + count);
          header_analista.push('Saída ' + count);
        }
      }

      header_analista.push('Horas Trab');
      header_analista.push('Comentários');
      
      // Cabecalho montado dinamicamente
      headers.push(header_analista);

      // monta as linhas
      let rows_analista = [];
      
      linha = 0;
      while (linha < fil.length){
        
        let cols = [];
        let dia = moment(fil[linha].data).format('DD MMM');
        let dia_semana = moment(fil[linha].data).format('dddd');
        let total_dia = moment(fil[linha].data).set(fil[linha].horas_periodo).format('HH:mm');
        let observacao = fil[linha].observacao;
        
        cols.push(dia);
        cols.push(dia_semana);

        data_atual = fil[linha].data;
        while(linha < fil.length && data_atual === fil[linha].data){
          let hora = moment(fil[linha].hora).format('HH:mm');
          cols.push(hora);
          linha++;
        }

        while( (cols.length - 2 ) < maximo){
          cols.push('');
        }

        linha--;

        cols.push(total_dia);
        cols.push(observacao);
        rows_analista.push(cols);
        
        linha++;

      }
      
      rows.push(rows_analista);
      
    });

    const dadosTratados = {
      worksheetNames: worksheetNames,
      headers: headers,
      rows: rows
    }

    return dadosTratados;

  }

}
