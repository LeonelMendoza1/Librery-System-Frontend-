import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.authService.saveAuthData(response.token, response.role);
  
        // Redirige al home correspondiente según el rol
        if (response.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin/home']);
          console.log(response.role);
        } else if (response.role === 'ROLE_USER') {
          this.router.navigate(['/user/home']);
          console.log(response.role);
        } else {
          this.router.navigate(['/home']); // Caso general
          console.log(response.role);
        }
      },
      (error) => {
        this.errorMessage = 'Email o contraseña inválidos';
      }
    );
  }
}
