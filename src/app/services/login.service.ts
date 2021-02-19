import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../interfaces/login-interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Usuario } from '../interfaces/usuario-interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url:string = 'https://tlogic-timesheet-api-fv2ws.ondigitalocean.app/login/admin';
  private AuthUserBS: BehaviorSubject<Usuario> = new BehaviorSubject<Usuario>({} as Usuario);
  public currentUser = this.AuthUserBS.asObservable();

  constructor(private http: HttpClient, private storage: LocalStorageService) {}

  login(email: string, senha: string): Observable<Login>{
    return this.http.post<Login>(this.url,{email: email, senha: senha});
  }

  getToken(): string{
    const token:string = this.storage.get('token');
    return token;
  }

  getUsuarioAutenticado(){
    const usuario: Usuario = JSON.parse(this.storage.get('usuario')) as Usuario;
    return usuario;
  }

  isAutenticated(): boolean{
    let autenticated = false;
    if(this.getToken() && this.getUsuarioAutenticado()){
      autenticated = true;
    }
    return autenticated;
  }

  setUser(usuario: Usuario){
    this.AuthUserBS.next(usuario);
  }

  logoff(){
    this.setUser(null);
    this.storage.set('usuario', null);
    this.storage.set('token', null);
  }

}
