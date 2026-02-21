import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TitleSignal {
  private _title = signal<string>('App');

  title = this._title.asReadonly();

  set(value: string) {
    this._title.set(value);
  }

  constructor() {
    // Actualiza el título de la página cuando cambia la señal
    effect(() => {
      document.title = this._title();
    });
  }  
}
