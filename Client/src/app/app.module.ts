import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoginRegisterComponent} from './component/login-register/login-register.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "./service/auth.service";
import {HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HeadderComponent} from './component/headder/headder.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import { SidenavComponent } from './component/sidenav/sidenav.component';
import { ChatComponent } from './component/chat/chat.component';
import { SettingsComponent } from './component/settings/settings.component';
import {MatSidenavModule} from "@angular/material/sidenav";

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    HeadderComponent,
    SidenavComponent,
    ChatComponent,
    SettingsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
