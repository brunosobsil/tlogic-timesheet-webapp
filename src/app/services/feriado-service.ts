import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feriado } from '../interfaces/feriado-interface';
import { LoginService } from './login.service';
import { Event } from '../interfaces/event-interface';

@Injectable({
    providedIn: 'root'
})
export class FeriadoService {

    private url: string = 'https://tlogic-timesheet-api-fv2ws.ondigitalocean.app/feriado';
    //private url: string = 'http://localhost:8080/feriado';
    private token_api_calendario = 'YnJ1bm8uc29icmFsLnNpbHZhQGdtYWlsLmNvbSZoYXNoPTMyMzk0MDUx';

    constructor(private loginSvc: LoginService, private http: HttpClient){}

    async getFeriado(feriado: Feriado): Promise<Observable<Feriado>>{
        const token: string = await this.loginSvc.getToken();
        const header = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
         });
        return this.http.get<Feriado>(`${this.url}/${feriado.data}`, { headers: header });
    }

    async getFeriados(): Promise<Observable<Feriado[]>> {
        const token: string = await this.loginSvc.getToken();
        const header = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
         });
        return this.http.get<Feriado[]>(this.url, { headers: header });
    }

    async incluirFeriado(feriado: Feriado){
        const token: string = await this.loginSvc.getToken();
        const header = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
         });
         return this.http.post<Feriado>(this.url, feriado, { headers: header });
    }

    async incluirFeriados(feriados: Feriado[]){
        const token: string = await this.loginSvc.getToken();
        const header = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
         });
         return this.http.post<Feriado[]>(this.url + 's', feriados, { headers: header });
    }

    async alterarFeriado(feriado: Feriado){
        const token: string = await this.loginSvc.getToken();
        const header = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
         });
         return this.http.put<Feriado>(`${this.url}/${feriado.data}`, feriado, { headers: header });
    }

    async excluirFeriado(feriado: Feriado){
        const token: string = await this.loginSvc.getToken();
        const header = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
         });
         return this.http.delete<Feriado>(`${this.url}/${feriado.data}`, { headers: header });
    }

    async getFeriadosCalendarioAPI(ano: number, antecipacaoDeFeriado: boolean): Promise<Feriado[]>{
        const url:string = `https://api.calendario.com.br/?ano=${ano}&estado=RJ&cidade=RIO_DE_JANEIRO&token=${this.token_api_calendario}&json=true`;
        const events: Event[] = await this.http.get<Event[]>(url).toPromise();
        let feriados: Feriado[] = events.map(e => {
            // 1 = Feriados Nacionais, 2 = Feriados Estaduais, 3 = Feriados Municipais
            if( e.type_code == 1 || e.type_code == 2 || e.type_code == 3){
                let data = this.converteData(e.date);
                return { data, descricao: e.name};
            }
        });
        feriados = feriados.filter(f => f !== undefined);
        if(!antecipacaoDeFeriado){
            feriados = feriados.filter(f => f.descricao !== "Antecipacao Feriado");
        }
        return feriados;
    }

    private converteData(data: string){
        let string = data.substr(6,4) + '/' + data.substr(3,2) + '/' + data.substr(0,2);
        return new Date(string);
    }

}