import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared.module';
import { HomeComponent } from './screens/home/home.component';
import { RoutingModule } from './modules/routing.module';
import { FirebaseModule } from './modules/firebase.module';
import { LoginPageComponent } from './screens/auth/login-page/login-page.component';
import { GoogleSigninDirective } from './screens/auth/google-signin.directive';
import { AuthFormComponent } from './common/auth-form/auth-form.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import {
  BoardListComponent,
  DialogOverviewComponent,
} from './common/board-list/board-list.component';
import {
  BoardComponent,
  TaskDialogOverviewComponent,
} from './common/board/board.component';
import { DeleteButtonComponent } from './delete-button/delete-button.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginPageComponent,
    GoogleSigninDirective,
    AuthFormComponent,
    TaskDialogOverviewComponent,
    DashboardComponent,
    DialogOverviewComponent,
    BoardListComponent,
    BoardComponent,
    DeleteButtonComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RoutingModule,
    SharedModule,
    FirebaseModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
