import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PrestationService } from './prestation.service';
import { Prestation } from './model/prestations.model';

@Component({
  selector: 'app-prestations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prestations.component.html',
  styleUrls: ['./prestations.component.css']
})
export class PrestationsComponent implements OnInit, OnDestroy {
  prestations: Prestation[] = [];
  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private prestationService: PrestationService) { }

  ngOnInit(): void {
    this.loadPrestations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge toutes les prestations
   */
  loadPrestations(): void {
    this.loading = true;
    this.error = null;

    this.prestationService.getAllPrestations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prestations) => {
          this.prestations = prestations;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
          console.error('Erreur lors du chargement des prestations:', error);
        }
      });
  }

  /**
   * Supprime une prestation
   */
  deletePrestation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) {
      this.prestationService.deletePrestation(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.prestations = this.prestations.filter(p => p.id !== id);
          },
          error: (error) => {
            this.error = error.message;
            console.error('Erreur lors de la suppression:', error);
          }
        });
    }
  }

  /**
   * Formate le prix en euros
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  /**
   * Formate la durée en heures et minutes
   */
  formatDuration(minutes: number): string {
    if (!minutes) return 'Non spécifiée';

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${remainingMinutes}min`;
    }
  }

  /**
   * Rafraîchit la liste
   */
  refresh(): void {
    this.loadPrestations();
  }
}