import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'library-system-frontend';
  constructor(private router: Router, private authService: AuthService) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    console.log('Se llamó a logout desde el componente');
    this.router.navigate(['/home']);
  }

  goToMyBorrows(){
    this.router.navigate(['/user/my-borrows']);
  }

  get userRole(): string {
    return this.authService.getUserRole();
  }

  isLoggedIn(): boolean{
    //const loggedIn = !!this.authService.isLoggedIn();
   // console.log('Estado de autenticación:', loggedIn);
    return this.authService.isLoggedIn();
  }
}
