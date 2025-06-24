import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from './chat-service';
import { CommonModule } from '@angular/common';

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

  constructor(private chatService: ChatService) {}

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

  clickChat(chat: any) {
    this.chatSelecionado = chat;
    this.isLeftPanelOpen = false;
  }

  async enviarMensagem() {
    const message = this.userMessage.value?.trim();
    if (!message) return;

    let chatAtual = this.chatSelecionado;

    if (!this.chatSelecionado) {
      chatAtual = await this.novoChat();
    }

    const userId = localStorage.getItem("meuId");

    const novaMensagemUsuario = {
      userId: crypto.randomUUID(),
      text: message,
      id: userId
    };

    chatAtual.messages.push(novaMensagemUsuario);

    const resposta = "[Mensagem fixa]"; // mock do ChatGPT

    const novaRespostaChatGPT = {
      userId: "chatbot",
      text: resposta,
      id: crypto.randomUUID()
    };

    chatAtual.messages.push(novaRespostaChatGPT);
    this.chatSelecionado = { ...chatAtual };

    await this.chatService.atualizarChat(chatAtual.id, chatAtual);
    this.userMessage.setValue('');
    await this.getChats();
  }

  async novoChat() {
    const nomeChat = prompt("Digite o nome do novo chat:");
    if (!nomeChat) {
      alert("Nome inválido.");
      return;
    }

    this.isLeftPanelOpen = false;

    const userId = localStorage.getItem("meuId");
    const novoChatObj = {
      id: crypto.randomUUID(),
      chatTitle: nomeChat,
      messages: [],
      userId
    };

    this.chatSelecionado = novoChatObj;
    this.userMessage.setValue('');

    await this.chatService.criarChat(novoChatObj);
    await this.getChats();
    return novoChatObj;
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
