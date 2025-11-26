import { Routes } from '@angular/router';
import {Home} from './_components/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
];
