import { Component, OnInit } from '@angular/core';
import { PrestationsService, Prestation } from '../prestations.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prestations-list',
  imports: [CommonModule],
  templateUrl: './prestations-list.component.html',
  styleUrl: './prestations-list.component.css'
})
export class PrestationsListComponent {
  prestations: Prestation[] = [];
  loading = true;
  error: string | null = null;

  constructor(private prestationsService: PrestationsService) { }

  ngOnInit() {
    this.prestationsService
      .getPrestations()
      .subscribe({
        next: (data) => {
          this.prestations = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur de chargement des prestations', err);
          this.error = 'Impossible de charger les prestations';
          this.loading = false;
        }
      });
  }
}
