// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/prestations',
        pathMatch: 'full'
    },
    {
        path: 'prestations',
        loadComponent: () => import('./prestations/prestations-list/prestations-list.component')
            .then(c => c.PrestationsListComponent)
    },
    {
        path: '**',
        redirectTo: '/prestations'
    }
];