import {MessageType} from '../_enums/messageType';
import {MessageService} from 'primeng/api';

export class NotificationExtension {

  constructor(private messageService: MessageService) {
  }

  showMessage(type: MessageType, detail: string) {
    let summary = '';
    switch(type) {
      case MessageType.SUCCESS: summary = 'Success'; break;
      case MessageType.INFO: summary = 'Info'; break;
      case MessageType.WARN: summary = 'Warn'; break;
      case MessageType.ERROR: summary = 'Error'; break;
    }
    this.messageService.add({ severity: type, summary, detail });
  }
}
