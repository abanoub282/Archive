import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards';

const routes: Routes = [

  {
    path: 'auth',
    loadChildren: "./modules/auth/auth.module#AuthModule",
  },
  {
    path: '',
    loadChildren: './modules/dashboard/dashboard.module#DashboardModule',
    canActivate : [AuthGuard]

  },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
