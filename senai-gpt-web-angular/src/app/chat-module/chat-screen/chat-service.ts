import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly API = 'https://senai-gpt-api.azurewebsites.net';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('meuToken')}`
      })
    };
  }

  async getChats(): Promise<any[]> {
    return await this.http.get<any[]>(`${this.API}/chats`, this.getAuthHeaders()).toPromise() ?? [];
  }

  async getMessagesByChatId(chatId: number): Promise<any[]> {
    return await this.http.get<any[]>(`${this.API}/messages?chatId=${chatId}`, this.getAuthHeaders()).toPromise() ?? [];
  }

  async criarChat(chat: any) {
    return await this.http.post(`${this.API}/chats`, chat, this.getAuthHeaders()).toPromise();
  }

  async adicionarMensagem(mensagem: any) {
    return await this.http.post(`${this.API}/messages`, mensagem, this.getAuthHeaders()).toPromise();
  }

  async deletarChat(id: number) {
    await this.http.delete(`${this.API}/chats/${id}`, this.getAuthHeaders()).toPromise();
    const mensagens = await this.getMessagesByChatId(id);
    for (const msg of mensagens) {
      await this.http.delete(`${this.API}/messages/${msg.id}`, this.getAuthHeaders()).toPromise();
    }
  }
}
