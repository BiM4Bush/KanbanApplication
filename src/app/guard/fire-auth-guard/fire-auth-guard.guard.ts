import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, UrlTree } from '@angular/router';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SnackService } from '../../services/snack.service';

@Injectable({
  providedIn: 'root',
})
export class FireAuthGuardGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private snack: SnackService) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return from(this.afAuth.currentUser).pipe(
      map((user) => !!user),
      tap((user) => {
        if (!user) {
          this.snack.authError();
        }
      })
    );
  }
}
