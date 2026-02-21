import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar-store',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar-store.html',
  styleUrl: './sidebar-store.css',
})
export class SidebarStore {}
