import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { routing } from './app-routing.module';

import { AlertComponent} from './_directives';
import { AuthGuard, EnterpriseGuard, UsernameGuard } from './_guards';
import { AlertService, AuthenticationService, CallsService, DataService } from './_services';
import { LoginComponent } from './user_management/login';
import { RegisterComponent } from './user_management/register';
import { AccountComponent } from './user_management/account';
import { EnterpriseComponent, GalleryModalComponent } from './user_management/enterprise';
import { BatchComponent } from './user_management/batch';
import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar'
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DetailComponent } from './user_management/detail';
import { SettingsComponent } from './user_management/settings';
import { DataTablesModule } from 'angular-datatables';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PersonalComponent }  from './user_management/register/personal/personal.component';
import { OtherComponent }      from './user_management/register/other/other.component';
import { DocumentsComponent }      from './user_management/register/documents/documents.component';
import { DisclaimersComponent }      from './user_management/register/disclaimers/disclaimers.component';
import { NavbarComponent }   from './user_management/register/navbar/navbar.component';
import { PasswordChangeComponent } from './user_management/settings/passwordChange/passwordChange.component';
import { CreateAdminComponent } from './user_management/settings/createAdmin/createAdmin.component';
import { FormDataService }    from './user_management/register/data/formData.service';
import { ModalModule } from 'ngx-bootstrap';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EmailServerComponent } from './user_management/settings/emailServer/emailServer.component';
import { EmailTemplateComponent } from './user_management/settings/emailTemplate/emailTemplate.component';
import { VideoComponent } from './user_management/register/video/video.component';
import { IdentityDocumentComponent } from './user_management/register/identityDocument/identityDocument.component';
import { ModalGalleryModule } from '@ks89/angular-modal-gallery';
import 'hammerjs';
import 'mousetrap';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { TokensComponent, KYCModalComponent } from './tokens/tokens.component';


@NgModule({
    imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      routing,
      BsDropdownModule.forRoot(),
      NgSelectModule,
      ProgressbarModule.forRoot(),
      TooltipModule.forRoot(),
      DataTablesModule,
      PdfViewerModule,
      ModalModule.forRoot(),
      RecaptchaModule.forRoot(),
      RecaptchaFormsModule,
      BsDatepickerModule.forRoot(),
      ModalGalleryModule.forRoot(),
      DeviceDetectorModule.forRoot()
    ],
    declarations: [
      AppComponent,
      AlertComponent,
      LoginComponent,
      RegisterComponent,
      AccountComponent,
      EnterpriseComponent,
      DetailComponent,
      BatchComponent,
      NavbarComponent, 
      PersonalComponent, 
      OtherComponent,
      DisclaimersComponent, 
      DocumentsComponent,
      SettingsComponent,
      PasswordChangeComponent,
      CreateAdminComponent,
      EmailServerComponent,
      EmailTemplateComponent,
      VideoComponent,
      IdentityDocumentComponent,
      GalleryModalComponent,
      TokensComponent,
      KYCModalComponent
    ],
    entryComponents: [
      GalleryModalComponent,
      KYCModalComponent
    ],
    providers: [
	    AppComponent,
      AuthGuard,
      AlertService,
      CallsService,
      EnterpriseGuard,
      UsernameGuard,
      DataService,
      AuthenticationService,
      { provide: FormDataService, useClass: FormDataService }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
