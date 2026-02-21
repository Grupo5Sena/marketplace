import { inject, Injectable } from '@angular/core';
import { Api } from '../../core/services/api';

@Injectable({
  providedIn: 'root',
})
export default class DashboardService {
  private api = inject(Api);

  getDashboard(params: { range: 'day' | 'month'; compare: boolean }) {
    return this.api.get('/dashboard', {
      params: {
        range: params.range,
        compare: params.compare,
      },
    });
  }
  
}
