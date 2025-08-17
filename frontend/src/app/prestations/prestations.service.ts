// import { Category } from './../../../../backend/src/category/entities/category.entity';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Prestation {
  id: number;
  title: string;
  description: string;
  duration: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  category: Category
}

@Injectable({
  providedIn: 'root'
})
export class PrestationsService {
  private baseUrl = `${environment.apiBase}/prestation`;
  
  constructor(private http: HttpClient) {}

  getPrestations(): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(this.baseUrl);
  }

  getPrestationsById(): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(this.baseUrl);
  }
}
