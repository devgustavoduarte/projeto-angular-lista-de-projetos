import { Component, EventEmitter, Output } from "@angular/core";
import { Project, Task } from "../../data/task.model";
import { GeneratePdfComponent } from "../../ui/generate-pdf/generate-pdf.component";
import { hideDiv } from "../../core/HideItem";

@Component({
  selector: "hide-button",
  templateUrl: "./hide-button.component.html",
})
export class HideButtonComponent
  extends GeneratePdfComponent
  implements hideDiv
{
  hideDiv(): void {}
  @Output() isTasksSort: EventEmitter<boolean> = new EventEmitter();

  public itemModel: Project | Task;
  public itemModelTask: Task;
}
