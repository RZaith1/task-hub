import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="w-64 p-4 bg-gray-100 h-full shadow-md">
      <h3 class="font-semibold mb-2">Menu</h3>
      <ul class="space-y-2">
        <li><a routerLink="/tasks" class="hover:underline">All Tasks</a></li>
        <li><a routerLink="/create" class="hover:underline">Create Task</a></li>
        <li><a routerLink="/settings" class="hover:underline">Settings</a></li>
      </ul>
    </aside>
  `
})
export class SidebarComponent {}
