import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environment';

@Pipe({
  name: 'imageUrl',
  standalone: true,
})
export class ImageUrlPipe implements PipeTransform {
  transform(path: string | null | undefined): string {
    if (!path) return '';
    return `${environment.apiUrl}${path}`;
  }  
}
