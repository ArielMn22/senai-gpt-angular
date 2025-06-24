import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly API = 'https://senai-gpt-api.azurewebsites.net/chats';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('meuToken')}`
      })
    };
  }

  async getChats(): Promise<any[]> {
    return await this.http.get<any[]>(this.API, this.getAuthHeaders()).toPromise() ?? [];
  }

  async criarChat(chat: any) {
    return await this.http.post(this.API, chat, this.getAuthHeaders()).toPromise();
  }

  async atualizarChat(id: string, chat: any) {
    return await this.http.put(`${this.API}/${id}`, chat, this.getAuthHeaders()).toPromise();
  }

  async deletarChat(id: string) {
    return await this.http.delete(`${this.API}/${id}`, this.getAuthHeaders()).toPromise();
  }
}
