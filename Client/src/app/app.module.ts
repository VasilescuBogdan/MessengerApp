import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './component/login-register/login-register.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "./service/auth.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeadderComponent } from './component/headder/headder.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { ChatComponent } from './component/chat/chat.component';
import { SettingsComponent } from './component/settings/settings.component';
import { MatSidenavModule } from "@angular/material/sidenav";
import { AuthInterceptor } from "./security/auth.interceptor";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { AddGroupDialogComponent } from './component/add-group-dialog/add-group-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    HeadderComponent,
    ChatComponent,
    SettingsComponent,
    AddGroupDialogComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    MatMenuModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
