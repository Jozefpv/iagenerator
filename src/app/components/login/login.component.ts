import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.loginForm.valid) {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe(res => {
      if (res) {
        localStorage.setItem('userGuid', res.userGuid);
        this.router.navigate(['/']);
      } else {
        this.loginForm.get('email')?.setErrors({ invalid: true });
        this.loginForm.get('password')?.setErrors({ invalid: true });
        this.showNotification('Error en las credenciales. Inténtalo de nuevo.', 'Cerrar', 5000);
      }
    });
  }

  showNotification(message: string, action: string = '', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
