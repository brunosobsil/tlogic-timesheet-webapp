// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RelatorioExtratoHorasRoutingModule } from './relatorio-extrato-horas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
@NgModule({
  imports: [
    CommonModule,
    RelatorioExtratoHorasRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  
})
export class RelatorioExtratoHorasModule { }
