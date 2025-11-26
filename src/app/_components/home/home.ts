import {Component} from '@angular/core';
import {LoadingService} from '../../_services/loading.service';
import {Form} from '../form/form';
import {Charts} from '../charts/charts';
import {GeocodingResult} from '../../_models/_types/geocodingResults';
import {HomeService} from '../../_services/home.service';
import {MessageType} from '../../_models/_enums/messageType';
import {NotificationExtension} from '../../_models/_extensions/notification.extension';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-home',
  imports: [
    Form,
    Charts
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home extends NotificationExtension {
  weatherData: any = null;

  constructor(private homeService: HomeService, private loadingService: LoadingService, messageService: MessageService) {
    super(messageService);
  }

  onLocationSelected(place: GeocodingResult) {
    this.loadingService.addLoader();
    this.homeService.getWeather(place.latitude, place.longitude)
      .subscribe({
        next: data => {
          this.weatherData = data;
          this.loadingService.removeLoader();
        },
        error: () => {
          this.loadingService.removeLoader();
          this.showMessage(MessageType.ERROR, 'Errore nel recupero dei dati');
        }
  });
  }

}
