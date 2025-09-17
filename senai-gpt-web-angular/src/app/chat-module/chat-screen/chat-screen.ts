import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from './chat-service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.html',
  styleUrls: ['./chat-screen.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ChatScreen implements OnInit {

  chats: any[] = [];
  chatSelecionado: any = null;
  userMessage = new FormControl('');
  isLeftPanelOpen = false;
  darkMode = false;
  mensagens: any[] = [];

  constructor(private chatService: ChatService, private http: HttpClient) { }

  ngOnInit(): void {
    const rascunho = localStorage.getItem('rascunhoMensagem');
    if (rascunho) this.userMessage.setValue(rascunho);

    this.getChats();

    const modoEscuro = localStorage.getItem('darkMode');
    if (modoEscuro === 'true') {
      this.darkMode = true;
      document.body.classList.add('dark-mode');
    }

    this.userMessage.valueChanges.subscribe(value => {
      localStorage.setItem('rascunhoMensagem', value || '');
    });
  }

  async getChats() {
    try {
      const json = await this.chatService.getChats();
      const userId = localStorage.getItem("meuId");
      this.chats = json.filter((chat: { userId: string }) => chat.userId === userId);
    } catch (err) {
      alert("Token inválido. Faça login novamente.");
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  onLogOutClick() {
    localStorage.clear();
    window.location.href = "/login";
  }

  async clickChat(chat: any) {
    this.chatSelecionado = chat;
    this.mensagens = await this.chatService.getMessagesByChatId(chat.id);
    this.isLeftPanelOpen = false;
  }

  async enviarMensagem() {
    const texto = this.userMessage.value?.trim();
    
    if (!texto) return;

    let chatAtual = this.chatSelecionado;

    if (!chatAtual) {
      chatAtual = await this.novoChat();
    }

    const userId = localStorage.getItem("meuId");

    const novaMensagemUsuario = {
      chatId: chatAtual.id,
      userId,
      text: texto
    };

    await this.chatService.adicionarMensagem(novaMensagemUsuario);

    await this.getChats();

    // let respostaGPT = await firstValueFrom(this.http.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
    //   "contents": [
    //     {
    //       "parts": [
    //         {
    //           "text": texto
    //         }
    //       ]
    //     }
    //   ]
    // }, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-goog-api-key": "KEY"
    //   }
    // })) as any;

    const novaRespostaChatGPT = {
      chatId: chatAtual.id,
      userId: 'chatbot',
      // text: respostaGPT.candidates[0].content.parts[0].text
      text: '[Mensagem fixa]'
    };

    await this.chatService.adicionarMensagem(novaRespostaChatGPT);

    this.userMessage.setValue('');
    this.mensagens = await this.chatService.getMessagesByChatId(chatAtual.id);
    await this.getChats();
  }

  async novoChat() {
    const nomeChat = prompt("Digite o nome do novo chat:");
    if (!nomeChat) {
      alert("Nome inválido.");
      return;
    }

    const userId = localStorage.getItem("meuId");
    const novoChatObj = {
      chatTitle: nomeChat,
      userId
    };

    const chatCriado = await this.chatService.criarChat(novoChatObj);
    this.chatSelecionado = chatCriado;
    this.mensagens = [];
    this.userMessage.setValue('');
    await this.getChats();
    return chatCriado;
  }

  async deletarChat() {
    const confirmacao = window.confirm("Você tem certeza que deseja deletar este chat?");
    this.isLeftPanelOpen = false;

    if (confirmacao && this.chatSelecionado) {
      await this.chatService.deletarChat(this.chatSelecionado.id);
      this.chatSelecionado = null;
      await this.getChats();
    }
  }

  toggleLeftPanel() {
    this.isLeftPanelOpen = !this.isLeftPanelOpen;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
    localStorage.setItem('darkMode', String(this.darkMode));
  }
}
