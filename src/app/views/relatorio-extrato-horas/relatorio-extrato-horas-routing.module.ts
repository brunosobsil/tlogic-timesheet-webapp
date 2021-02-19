import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelatorioExtratoHorasComponent } from './relatorio-extrato-horas.component';

const routes: Routes = [
  {
    path: '',
    component: RelatorioExtratoHorasComponent,
    data: {
      title: 'Relatório Extrato Horas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatorioExtratoHorasRoutingModule {}
