import { inject, Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { CreateStoreDto } from '../pages/dto/create-store.dto';
import { Store } from '../../interfaces/store-model';
import { UserProfile } from '../../interfaces/user-profile';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private api = inject(Api);

  createStore(dto: CreateStoreDto) {
    return this.api.post<{ store: Store; user: UserProfile }>(
      '/stores',
      dto
    );
  }
}
