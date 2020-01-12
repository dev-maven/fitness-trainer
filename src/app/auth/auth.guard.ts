import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanLoad, Route } from '@angular/router';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(
        private store: Store<fromRoot.State>,
        // private authService: AuthService,
        private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if (this.authService.isAuth()) {
        //     return true;
        // } else {
        //     this.router.navigate(['/login']);
        // }
        return this.store.select(fromRoot.getIsAuth).pipe(take(1));
    }

    canLoad (route: Route ) {
        // if (this.authService.isAuth()) {
        //     return true;
        // } else {
        //     this.router.navigate(['/login']);
        // }
        return this.store.select(fromRoot.getIsAuth).pipe(take(1));
    }
}
