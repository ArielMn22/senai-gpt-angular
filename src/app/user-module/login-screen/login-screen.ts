import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-screen.html',
  styleUrls: ['./login-screen.css']
})
export class LoginScreen {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onLoginClick(): Promise<void> {
    if (this.loginForm.invalid) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      const response = await fetch('https://senai-gpt-api.azurewebsites.net/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        alert('Login realizado com sucesso!');
        const json = await response.json();
        localStorage.setItem('meuToken', json.accessToken);
        localStorage.setItem('meuId', json.user.id);
        window.location.href = '/chat';
      } else if (response.status === 401) {
        alert('Credenciais incorretas. Tente novamente.');
      } else {
        alert('Erro inesperado aconteceu, caso persista, contate os administradores.');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor.');
      console.error(error);
    }
  }
}
