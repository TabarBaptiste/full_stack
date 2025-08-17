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
        loadComponent: () => import('./features/prestations/prestations.component')
            .then(c => c.PrestationsComponent)
    },
    // {
    //     path: 'prestations/create',
    //     loadComponent: () => import('./features/prestations/prestation-form/prestation-form.component')
    //         .then(c => c.PrestationFormComponent)
    // },
    {
        path: 'prestations/:id',
        loadComponent: () => import('./features/prestations/prestations-details/prestations-details.component')
            .then(c => c.PrestationsDetailsComponent)
    },
    // {
    //     path: 'prestations/:id/edit',
    //     loadComponent: () => import('./features/prestations/prestation-form/prestation-form.component')
    //         .then(c => c.PrestationFormComponent)
    // },
    {
        path: '**',
        redirectTo: '/prestations'
    }
];