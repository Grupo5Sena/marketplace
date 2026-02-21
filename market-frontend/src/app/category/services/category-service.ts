import { inject, Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { Category } from '../../interfaces/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class CategoryService {
  private api = inject(Api);

  list(): Observable<Category[]> {
    return this.api.get<Category[]>('/categories/select/list');
  }  
}
