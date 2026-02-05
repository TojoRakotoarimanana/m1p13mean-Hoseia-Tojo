import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) { }

  success(message: string, title: string = 'Succès') {
    this.messageService.add({ severity: 'success', summary: title, detail: message, life: 3000 });
  }

  error(message: string, title: string = 'Erreur') {
    this.messageService.add({ severity: 'error', summary: title, detail: message, life: 5000 });
  }

  info(message: string, title: string = 'Information') {
    this.messageService.add({ severity: 'info', summary: title, detail: message, life: 3000 });
  }

  warn(message: string, title: string = 'Attention') {
    this.messageService.add({ severity: 'warn', summary: title, detail: message, life: 4000 });
  }
}
