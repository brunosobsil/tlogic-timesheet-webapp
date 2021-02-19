import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { LoginService } from '../services/login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private loginSvc: LoginService){}

    canActivate(route: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot): boolean {
        //console.log('can activate');
        if(!this.loginSvc.isAutenticated()){
            //console.log('nao autenticado');
            this.router.navigate(['/login']);
        }else{
            //console.log('autenticado');
            return true;
        }
    }
}