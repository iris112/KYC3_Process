import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './user_management/login';
import { RegisterComponent } from './user_management/register';
import { AccountComponent } from "./user_management/account";
import { AuthGuard, EnterpriseGuard, UsernameGuard } from './_guards';
import { EnterpriseComponent } from './user_management/enterprise';
import { BatchComponent } from './user_management/batch';
import { DetailComponent } from './user_management/detail';
import { SettingsComponent } from './user_management/settings';
import { TokensComponent } from './tokens/tokens.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account/:username', component: AccountComponent, canActivate: [AuthGuard,UsernameGuard]},
  { path: 'enterprise', component: EnterpriseComponent, canActivate: [EnterpriseGuard], data: { enterpriseGuardRedirect: 'account/:username', roles: ['admin']}},
  { path: 'settings', component: SettingsComponent, canActivate: [EnterpriseGuard], data: { enterpriseGuardRedirect: 'account/:username'}},
  { path: 'detail/:username', component: DetailComponent, canActivate: [EnterpriseGuard], data: { enterpriseGuardRedirect: 'account/:username'}},
  { path: 'batch', component: BatchComponent, canActivate: [EnterpriseGuard], data: { enterpriseGuardRedirect: 'account/:username'} },
  { path: 'tokens', component: TokensComponent},
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
