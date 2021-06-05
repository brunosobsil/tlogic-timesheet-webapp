import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feriado } from '../interfaces/feriado-interface';
import { LoginService } from './login.service';

@Injectable({
    providedIn: 'root'
})
export class FeriadoService {

    private url: string = 'https://tlogic-timesheet-api-fv2ws.ondigitalocean.app/feriado';
    //private url: string = 'http://localhost:8080/feriado';

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

}