import { isPlatformWorkerApp } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Usuario } from '../../interfaces/usuario-interface';
import { navItems } from '../../_nav';
import { LoginService } from '../../services/login.service';  
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit{
  public sidebarMinimized = false;
  public navItems = navItems;
  public isMobile = false;
  public currentUser: Usuario;

  constructor(private loginSvc: LoginService, 
              private storage: LocalStorageService,
              private router: Router){}

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  ngOnInit(){
    if(window.innerWidth <= 900){
      this.isMobile = true;
    }
    this.loginSvc.currentUser.subscribe(user => this.currentUser = user);

    if(!this.currentUser.nome && this.loginSvc.isAutenticated()){
      this.currentUser = this.loginSvc.getUsuarioAutenticado();
    }
  }

  logoff(){
    this.loginSvc.logoff();
    this.router.navigate(['/login']);
  }

}
