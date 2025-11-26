import {Injectable} from '@angular/core';

@Injectable({
  providedIn: "root"
  })
export class LoadingService {

  private loader: boolean = false;

  isLoading() :boolean{
    return this.loader
  }

  addLoader(){
    this.loader = true;
  }

  removeLoader(){
    this.loader = false
  }


}
