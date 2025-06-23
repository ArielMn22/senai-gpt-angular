import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user-screen.html',
  styleUrls: ['./new-user-screen.css'],
  imports: [
    ReactiveFormsModule,
  ]
})
export class NewUserScreen {

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  async onNewUserClick(): Promise<void> {
    if (this.userForm.invalid) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const { name, email, password, confirmPassword } = this.userForm.value;

    if (password !== confirmPassword) {
      alert("As senhas não conferem.");
      return;
    }

    try {
      const response = await this.http.post(
        "https://senai-gpt-api.azurewebsites.net/users",
        { name, email, password },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          observe: 'response'
        }
      ).toPromise();

      if (response?.ok) {
        alert("Novo usuário cadastrado com sucesso!");
        this.router.navigate(['/login']);
      } else {
        throw new Error("Erro ao cadastrar usuário.");
      }
    } catch (error) {
      alert("Erro inesperado aconteceu, caso persista, contate os administradores.");
    }
  }
}
