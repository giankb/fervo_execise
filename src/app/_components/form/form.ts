import {Component, EventEmitter, Output} from '@angular/core';
import {LoadingService} from '../../_services/loading.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {NgClass} from '@angular/common';
import {HomeService} from '../../_services/home.service';
import {MessageService} from 'primeng/api';
import {MessageType} from '../../_models/_enums/messageType';
import {AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent} from 'primeng/autocomplete';
import {GeocodingResult} from '../../_models/_types/geocodingResults';
import {NotificationExtension} from '../../_models/_extensions/notification.extension';

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    NgClass,
    AutoComplete,
    FormsModule,
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
  standalone: true
})
export class Form extends NotificationExtension{

  @Output() locationSelected = new EventEmitter<GeocodingResult>();

  selectedPlace: GeocodingResult | null = null;
  filteredPlaces: GeocodingResult[] = [];
  debounceTimer: any;

  constructor(
    private loadingService: LoadingService,
    private homeService: HomeService,
    messageService: MessageService
  ) {
    super(messageService);}

  filterPlace(event: AutoCompleteCompleteEvent) {
    const address = event.query;

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      if (!address || address.length < 3) return;

      this.homeService.getPosition(address).subscribe({
        next: data => {
          this.filteredPlaces = data.results || [];
        },
        error: () => {
          this.showMessage(MessageType.ERROR, 'Errore nel recupero dei dati');
        }
      });
    }, 400);
  }

  getPlaceLabel(place: GeocodingResult | null): string {
    return place ? `${place.name} - ${place.country}` : '';
  }

  selectPlace(event: AutoCompleteSelectEvent) {
    this.selectedPlace = event.value;
  }

  sendLocation() {
    if (!this.selectedPlace) return;
    this.locationSelected.emit(this.selectedPlace);
  }


}
