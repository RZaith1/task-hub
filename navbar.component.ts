import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
      <div class="font-bold text-xl">Task Hub</div>
      <button (click)="logout()" class="bg-red-500 px-3 py-1 rounded">Logout</button>
    </nav>
  `
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
