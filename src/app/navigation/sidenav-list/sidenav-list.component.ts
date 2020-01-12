import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  // isAuth = false;
  isAuth$: Observable<boolean>;
  authSubscription: Subscription;

    @Output() closeSidenav = new EventEmitter<void>();
  constructor(private authService: AuthService, 
              private store: Store<fromRoot.State>) { }

  ngOnInit() {
    // this.authService.authChange.subscribe(authStatus => {
    //   this.isAuth = authStatus;
    // });
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.authService.logout();
    this.onClose();
  }

  // ngOnDestroy() {
  //   this.authSubscription.unsubscribe();
  // }

}
