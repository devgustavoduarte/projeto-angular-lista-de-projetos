import { Component, Input } from "@angular/core";
import { TaskService } from "../services/task.service";

@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.sass"],
})
export class TasksComponent {
  constructor(public taskService: TaskService) {}

  @Input() public value: number = 2.5;
}
