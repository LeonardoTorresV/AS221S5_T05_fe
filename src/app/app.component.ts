import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showDashboard = false;

  toggleView() {
    this.showDashboard = !this.showDashboard;
    console.log('showDashboard:', this.showDashboard); // Para depuración
  }
}