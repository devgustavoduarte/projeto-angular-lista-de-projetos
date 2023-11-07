import { Component, EventEmitter, Output } from '@angular/core';
import { Project, Task } from '../../data/task.model';

@Component({
  selector: 'sort-button',
  templateUrl: './sort-button.component.html'
})

export class SortButtonComponent {

  @Output() isTasksSort: EventEmitter<boolean> = new EventEmitter();

  public itemModel: Project | Task;
  public itemModelTask: Task;

  onSortTask(): void {
    this.isTasksSort.emit(null);
    console.log(this.itemModelTask)
  }
}
