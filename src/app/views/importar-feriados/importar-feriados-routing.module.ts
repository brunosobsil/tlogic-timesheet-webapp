import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportarFeriadosComponent } from './importar-feriados.component';;

const routes: Routes = [
  {
    path: '',
    component: ImportarFeriadosComponent,
    data: {
      title: 'Importar Feriados'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportarFeriadosRoutingModule {}
