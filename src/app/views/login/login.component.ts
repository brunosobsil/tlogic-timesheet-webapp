import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Login } from '../../interfaces/login-interface';
import { LocalStorageService } from '../../services/local-storage.service'
import { HttpErrorResponse } from '@angular/common/http';
import { ModalsComponent } from '../notifications/modals.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  public loginForm: FormGroup;
  public loading: boolean;
  
  constructor(private loginSvc: LoginService, 
              private router: Router, 
              private storage: LocalStorageService,
              private modal: ModalsComponent){
    this.loginForm = new FormGroup({
      usuario: new FormControl('',Validators.required),
      senha: new FormControl('', Validators.required)
    });
    this.loading = false;
  }

  async entrar(){

    if(this.loading){
      return;
    }

    if(this.loginForm.valid){

      this.loading = true;

      let usuario = this.loginForm.value.usuario.trim();
      let senha = this.loginForm.value.senha.trim();
      try{
        this.loginSvc.login(usuario, senha)
          .subscribe(async (data: Login) => {
            await this.storage.set('token', data.token);
            await this.storage.set('usuario', JSON.stringify(data.usuario));
            this.loginSvc.setUser(data.usuario);
            this.router.navigate(['/dashboard']);
          },async (error: HttpErrorResponse) => {

            this.loading = false;
            
            if(error.status === 401){
              this.modal.open('Atenção','Usuário não autenticado!');
            }else if(error.status === 0){
              this.modal.open('Atenção','Não foi possível conectar com o servidor. Verifique sua conexão com a internet!');
            }else{
              this.modal.open('Atenção','Erro desconhecido. Tente novamente mais tarde.');
            }
          });
      }catch(e){
        
      }
    }else{
      this.modal.open('Atenção', 'Informe o usuário e a senha!');
    }
  }

 }
