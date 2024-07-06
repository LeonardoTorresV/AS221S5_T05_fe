import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent {
  
  @Output() goToDashboard = new EventEmitter<void>();

  navigateToDashboard() {
    this.goToDashboard.emit();
  }
}
