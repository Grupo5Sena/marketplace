import { Component, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarStore } from '../../home/pages/sidebar-store/sidebar-store';

@Component({
  selector: 'app-sotre-layout',
  imports: [CommonModule, RouterOutlet, SidebarStore],
  templateUrl: './sotre-layout.html',
  styleUrl: './sotre-layout.css',
})
export default class SotreLayout {

}
