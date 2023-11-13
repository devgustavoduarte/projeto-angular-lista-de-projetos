import { Component, EventEmitter, Output } from "@angular/core";
import { Project, Task } from "../../data/task.model";

@Component({
  selector: "print-button",
  templateUrl: "./sort-button.component.html",
})
export class SortButtonComponent {
  @Output() isTasksSort: EventEmitter<boolean> = new EventEmitter();

  public itemModel: Project | Task;
  public itemModelTask: Task;
}
