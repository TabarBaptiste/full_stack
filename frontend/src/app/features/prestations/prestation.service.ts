// frontend/src/app/features/prestations/prestation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Prestation, CreatePrestationDto, UpdatePrestationDto } from './model/prestations.model';

@Injectable({
  providedIn: 'root'
})
export class PrestationService {
  private readonly apiUrl = `${environment.apiBase}/prestation`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère toutes les prestations
   */
  getAllPrestations(): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupère une prestation par son ID
   */
  getPrestationById(id: number): Observable<Prestation> {
    return this.http.get<Prestation>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crée une nouvelle prestation
   */
  createPrestation(prestation: CreatePrestationDto): Observable<Prestation> {
    return this.http.post<Prestation>(this.apiUrl, prestation)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Met à jour une prestation
   */
  updatePrestation(id: number, prestation: UpdatePrestationDto): Observable<Prestation> {
    return this.http.put<Prestation>(`${this.apiUrl}/${id}`, prestation)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Supprime une prestation
   */
  deletePrestation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Erreur ${error.status}: ${error.message}`;
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('Erreur dans PrestationService:', error);
    return throwError(() => new Error(errorMessage));
  }
}