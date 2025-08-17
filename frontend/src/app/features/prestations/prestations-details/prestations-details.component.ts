// frontend/src/app/features/prestations/prestations-details/prestations-details.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PrestationService } from '../prestation.service';
import { Prestation } from '../model/prestations.model';
@Component({
  selector: 'app-prestations-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prestations-details.component.html',
  styleUrls: ['./prestations-details.component.css']
})
export class PrestationsDetailsComponent implements OnInit, OnDestroy {
  prestation: Prestation | null = null;
  loading = false;
  error: string | null = null;
  selectedDate: Date | null = null;
  selectedTime: string | null = null;

  // Calendrier
  currentMonth = new Date();
  calendarDays: (Date | null)[] = [];

  // Créneaux horaires disponibles (statique pour le moment)
  availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prestationService: PrestationService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = +params['id'];
        if (id) {
          this.loadPrestation(id);
        }
      });

    this.generateCalendar();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les détails de la prestation
   */
  loadPrestation(id: number): void {
    this.loading = true;
    this.error = null;

    this.prestationService.getPrestationById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prestation) => {
          this.prestation = prestation;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
          console.error('Erreur lors du chargement de la prestation:', error);
        }
      });
  }

  /**
   * Génère le calendrier du mois courant
   */
  generateCalendar(): void {
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    const startDate = new Date(firstDay);

    // Commence au lundi de la semaine contenant le premier jour
    startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));

    this.calendarDays = [];

    // Génère 42 jours (6 semaines)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // N'affiche que les dates du mois courant et les dates futures
      if (date.getMonth() === this.currentMonth.getMonth() && date >= new Date()) {
        this.calendarDays.push(date);
      } else {
        this.calendarDays.push(null);
      }
    }
  }

  /**
   * Navigue vers le mois précédent
   */
  previousMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  /**
   * Navigue vers le mois suivant
   */
  nextMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  /**
   * Sélectionne une date
   */
  selectDate(date: Date | null): void {
    if (!date) return;

    this.selectedDate = date;
    this.selectedTime = null; // Reset time selection
  }

  /**
   * Sélectionne un créneau horaire
   */
  selectTime(time: string): void {
    this.selectedTime = time;
  }

  /**
   * Vérifie si une date est sélectionnée
   */
  isDateSelected(date: Date | null): boolean {
    if (!date || !this.selectedDate) return false;
    return date.toDateString() === this.selectedDate.toDateString();
  }

  /**
   * Vérifie si un créneau est sélectionné
   */
  isTimeSelected(time: string): boolean {
    return this.selectedTime === time;
  }

  /**
   * Formate une date pour l'affichage
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
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
   * Obtient le nom du mois courant
   */
  getCurrentMonthName(): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long'
    }).format(this.currentMonth);
  }

  /**
   * Confirme le rendez-vous (pour le moment, juste un log)
   */
  confirmAppointment(): void {
    if (!this.selectedDate || !this.selectedTime || !this.prestation) {
      alert('Veuillez sélectionner une date et un créneau horaire');
      return;
    }

    // Créer l'objet rendez-vous
    const appointment = {
      prestationId: this.prestation.id,
      prestationName: this.prestation.title,
      date: this.selectedDate,
      time: this.selectedTime,
      price: this.prestation.price,
      duration: this.prestation.duration
    };

    console.log('Rendez-vous confirmé:', appointment);

    // Pour le moment, affichage d'une alerte
    alert(`Rendez-vous confirmé pour le ${this.formatDate(this.selectedDate)} à ${this.selectedTime} pour la prestation "${this.prestation.title}"`);

    // Redirection vers la liste des prestations
    this.router.navigate(['/prestations']);
  }

  /**
   * Retour à la liste des prestations
   */
  goBack(): void {
    this.router.navigate(['/prestations']);
  }

}