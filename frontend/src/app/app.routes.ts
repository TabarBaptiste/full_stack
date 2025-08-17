// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PrestationsComponent } from './features/prestations/prestations.component';
import { PrestationsDetailsComponent } from './features/prestations/prestations-details/prestations-details.component';

export const routes: Routes = [
    { path: '', redirectTo: '/prestations', pathMatch: 'full' },
    { path: 'prestations', component: PrestationsComponent },
    { path: 'prestations/:id', component: PrestationsDetailsComponent },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '/prestations' }
];