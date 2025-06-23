import { Routes } from '@angular/router';
import { LoginScreen } from './user-module/login-screen/login-screen';
import { NewUserScreen } from './user-module/new-user-screen/new-user-screen';
import { ChatScreen } from './chat-module/chat-screen/chat-screen';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => LoginScreen
    },
    {
        path: "login",
        loadComponent: () => LoginScreen
    },
    {
        path: "new-user",
        loadComponent: () => NewUserScreen
    },
    {
        path: "chat",
        loadComponent: () => ChatScreen
    }
];
