import { inject, Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private api = inject(Api);

  uploadFile(file: File, path: string = 'product'): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<{ url: string }>('/uploads/product', formData);
  } 
  
  uploadAvatar(file: File, path: string = 'avatar'): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<{ url: string }>('/uploads/avatar', formData);
  }
}
