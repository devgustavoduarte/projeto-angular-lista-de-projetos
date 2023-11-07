import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'float-button',
  templateUrl: './float-button.component.html'
})

export class FloatButtonComponent {

  @Output() isTaskAdded: EventEmitter<boolean> = new EventEmitter();

  onAddTask() {
    this.isTaskAdded.emit(null);
  }
}
