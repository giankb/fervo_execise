import {Component, Input, OnChanges} from '@angular/core';
import {UIChart} from 'primeng/chart';
import {HomeService} from '../../_services/home.service';
import {FormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {MessageService} from 'primeng/api';
import {NotificationExtension} from '../../_models/_extensions/notification.extension';
import {MessageType} from '../../_models/_enums/messageType';

@Component({
  selector: 'app-charts',
  imports: [
    UIChart,
    FormsModule,
    DatePicker
  ],
  templateUrl: './charts.html',
  styleUrl: './charts.scss',
  standalone: true
})
export class Charts extends NotificationExtension implements OnChanges {

  @Input() weatherData: any | null = null;
  today: Date = new Date();
  chartData: any;
  chartOptions: any;
  todayMax = 0;
  todayMin = 0;
  todayRain = 0;
  todayWind = 0;
  todayLabel = '';
  startDate!: string;
  endDate!: string;
  forecastDays: { weekday: string; date: string; tMax: number; tMin: number; rain: number; wind: number }[] = [];
  dateRange: Date[] = [];

  constructor(private homeService: HomeService, messageService: MessageService) {
    super(messageService)
  }

  ngOnChanges() {
    if (!this.weatherData) return;
    this.updateChart();
  }

  updateChart() {
    const d = this.weatherData.daily;

    this.chartData = {
      labels: d.time,
      datasets: [
        {
          type: 'line',
          label: 'Temp Max (°C)',
          data: d.temperature_2m_max,
          borderColor: '#FF6384',
          backgroundColor: 'transparent',
          yAxisID: 'y1'
        },
        {
          type: 'line',
          label: 'Temp Min (°C)',
          data: d.temperature_2m_min,
          borderColor: '#36A2EB',
          backgroundColor: 'transparent',
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Precipitazioni (mm)',
          data: d.precipitation_sum,
          backgroundColor: '#4BC0C0',
          yAxisID: 'y2'
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 12
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            font: { size: 10 }
          }
        },
        y1: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: '°C' },
          ticks: { font: { size: 10 } }
        },
        y2: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'mm' },
          grid: { drawOnChartArea: false },
          ticks: { font: { size: 10 } }
        }
      }
    };

    const lastIndex = d.time.length - 1;

    this.todayMax = d.temperature_2m_max?.[lastIndex] ?? 0;
    this.todayMin = d.temperature_2m_min?.[lastIndex] ?? 0;
    this.todayRain = d.precipitation_sum?.[lastIndex] ?? 0;
    this.todayWind = d.windspeed_10m_max?.[lastIndex] ?? 0;


    this.todayLabel = new Date(d.time[lastIndex]).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short' });

    this.forecastDays = d.time.slice(0, lastIndex).map((dateStr: string, idx: number) => ({
      weekday: new Date(dateStr).toLocaleDateString('it-IT', { weekday: 'short' }),
      date: new Date(dateStr).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
      tMax: d.temperature_2m_max?.[idx] ?? 0,
      tMin: d.temperature_2m_min?.[idx] ?? 0,
      rain: d.precipitation_sum?.[idx] ?? 0,
      wind: d.windspeed_10m_max?.[idx] ?? 0
    })).reverse();
  }

  getWeatherEmoji(day: { tMax: number, tMin: number, rain: number }): string {
    if(day.rain > 4) return '🌧️';
    if(day.tMax >= 20) return '☀️';
    if(day.tMin < 0) return '❄️';
    return '⛅';
  }

  downloadWeatherJSON() {

    if (!this.weatherData) return;

    const dataStr = JSON.stringify(this.weatherData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `weather_${this.weatherData.latitude}_${this.weatherData.longitude}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  updateWeatherRange() {
    if (!this.dateRange || this.dateRange.length !== 2 || !this.dateRange[0] || !this.dateRange[1]) {
      return;
    }

    const start = this.formatDateLocal(this.dateRange[0]);
    const end = this.formatDateLocal(this.dateRange[1]);

    this.homeService.getWeather(this.weatherData.latitude, this.weatherData.longitude, start, end)
      .subscribe({
        next: data => {
          this.weatherData = data;
          this.updateChart();
        },
        error: () => {
          this.showMessage(MessageType.ERROR, 'Errore nel caricamento dei dati');
        }
      });
  }

  formatDateLocal(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }


}
