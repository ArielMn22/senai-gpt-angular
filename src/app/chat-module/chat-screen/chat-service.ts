import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GeminiResponse } from '../../interfaces/gemini-response';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly API = 'https://senai-gpt-api.azurewebsites.net';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('meuToken') || ''}`
    });
  }

  private getAuthOptions() {
    return { headers: this.getAuthHeaders() };
  }

  async getChats(): Promise<any[]> {
    try {
      return await firstValueFrom(
        this.http.get<any[]>(`${this.API}/chats`, this.getAuthOptions())
      );
    } catch {
      return [];
    }
  }

  async getMessagesByChatId(chatId: number): Promise<any[]> {
    try {
      const params = new HttpParams().set('chatId', String(chatId));
      return await firstValueFrom(
        this.http.get<any[]>(`${this.API}/messages`, { ...this.getAuthOptions(), params })
      );
    } catch {
      return [];
    }
  }

  async criarChat(chat: any): Promise<any> {
    return await firstValueFrom(
      this.http.post<any>(`${this.API}/chats`, chat, this.getAuthOptions())
    );
  }

  async adicionarMensagem(mensagem: any): Promise<any> {
    return await firstValueFrom(
      this.http.post<any>(`${this.API}/messages`, mensagem, this.getAuthOptions())
    );
  }

  async deletarChat(id: number): Promise<void> {
    // Exclui o chat
    try {
      await firstValueFrom(
        this.http.delete<void>(`${this.API}/chats/${id}`, this.getAuthOptions())
      );
    } catch {
      // Se não conseguir deletar o chat, não prossegue (ou trate conforme sua regra)
      return;
    }

    // Tenta buscar mensagens remanescentes (caso a API não faça cascade)
    let mensagens: any[] = [];
    try {
      mensagens = await this.getMessagesByChatId(id);
    } catch {
      mensagens = [];
    }

    // Exclui cada mensagem (ignora erros individuais)
    for (const msg of mensagens) {
      try {
        await firstValueFrom(
          this.http.delete<void>(`${this.API}/messages/${msg.id}`, this.getAuthOptions())
        );
      } catch {
        // ignore
      }
    }
  }

  async chatCompletion(prompt: string): Promise<GeminiResponse | null> {
    // Exclui o chat
    try {
      let response = await firstValueFrom(
        this.http.post<GeminiResponse>(`${this.API}/chat-completion`, { prompt: prompt }, this.getAuthOptions())
      );

      if (response.candidates) {
        return response;
      } else {
        return null;
      }
    } catch {
      // Se não conseguir deletar o chat, não prossegue (ou trate conforme sua regra)
      return null;
    }
  }
}
