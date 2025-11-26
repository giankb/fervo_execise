import {AfterViewChecked, ChangeDetectorRef, Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Loader} from './_utils/loader/loader';
import {LoadingService} from './_services/loading.service';
import {Navbar} from './_components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader, Navbar],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss'
})
export class App implements AfterViewChecked{
  protected readonly title = signal('fervo_exercise');

  loading: boolean = false;
  constructor(protected loadingService: LoadingService, private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewChecked() {
    if(this.loading !== this.loadingService.isLoading()){
      this.loading = this.loadingService.isLoading()
      this.cdRef.detectChanges();
    }
  }


}
