import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  get baseUrl(): string {
    return environment.apiBase;
  }

  endpoint(path: string): string {
    // s'assure qu'il n'y a pas de double slash
    return `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}
