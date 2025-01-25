import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { BookComponent } from './components/book/book.component';
import { AuthGuard } from './auth.guard';
import { MyBorrowsComponent } from './components/my-borrows/my-borrows.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  // Ruta base para usuarios no autenticados
  { path: 'home', component: BookComponent },

  // Ruta para login
  { path: 'login', component: LoginComponent },

  //Ruta para el registro de usuarios
  { path: 'register', component: RegisterComponent },

  // Rutas protegidas para usuarios con rol USER
  {
    path: 'user',
    canActivate: [AuthGuard], // Aplica el guard a toda esta sección
    data: { role: 'ROLE_USER' }, // Especifica el rol requerido
    children: [
      { path: 'home', component: UserDashboardComponent },
      { path: 'my-borrows', component: MyBorrowsComponent },
    ],
  },

  // Rutas protegidas para usuarios con rol ADMIN
  {
    path: 'admin',
    canActivate: [AuthGuard], // Aplica el guard a toda esta sección
    data: { role: 'ROLE_ADMIN' }, // Especifica el rol requerido
    children: [
      { path: 'home', component: AdminDashboardComponent },
    ],
  },

  // Ruta por defecto (redirección)
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Ruta para páginas no encontradas
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
