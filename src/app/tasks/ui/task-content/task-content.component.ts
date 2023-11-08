import { Component } from "@angular/core";
import { TaskService } from "../../services/task.service";
import { Project, Task } from "../../data/task.model";
import { AddRemoveItem } from "../../core/AddRemoveItem";
import { UserInterfaceService } from "../../services/user-interface.service";
import { ItemType } from "../../core/base/ItemType";
import { combineLatest } from "rxjs";
import { SnackbarType } from "../../utils/handlers/SnackbarType";
import { SnackbarTime } from "../../utils/handlers/SnackbarTime";
import { environment } from "../../../../environments/environment.prod";
import { ItemBase } from "../../core/base/ItemBase";
import { take } from "rxjs/operators";
import { PrintPdfComponent } from "../print-pdf/print-pdf.component";
import jsPDF from "jspdf";

@Component({
  selector: "app-task-content",
  templateUrl: "./task-content.component.html",
  styleUrls: ["./task-content.component.sass"],
})
export class TaskContentComponent extends ItemBase<Task> {
  currentTaskIndex;

  public itemModel: Project | Task;
  public itemModelTask: Task;

  constructor(
    public readonly taskService: TaskService,
    public uiService: UserInterfaceService
  ) {
    super(uiService);
  }

  printPdf(task: Task): void {
    // let doc = new jsPDF()

    // let elementHtml = document.querySelector('#content') as HTMLElement

    // doc.html(elementHtml, {
    //   callback: (doc) => {
    //     doc.save('test.pdf')
    //   },
    //   x: 15,
    //   y: 15,
    //   width: 190,
    //   windowWidth: 650
    // })

    let newTaf = new Task(new Date());

    newTaf.description = task.description;
    newTaf.secondTitle = task.secondTitle;

    this.taskService.getCurrentProjectSubject().subscribe((e) => {
      if (newTaf != null) {
        let doc = new jsPDF();
        doc.setFont("Courier");
        doc.setFontSize(20);
        doc.text("Ficha do produto", 65, 15);

        doc.setFillColor(50, 50, 50);
        doc.rect(2, 20, 60, 8, "FD");
        doc.rect(2, 28, 60, 8, "FD");
        doc.rect(2, 36, 60, 8, "FD");
        doc.rect(40, 20, 160, 8, "FD");
        doc.rect(40, 28, 160, 8, "FD");
        doc.rect(40, 36, 160, 8, "FD");

        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text("ID", 3, 25);
        doc.text("Nome da tarefa", 3, 33);
        doc.text("Descrição", 3, 41);

        doc.setTextColor(255, 255, 255);
        if (this.itemModel && this.itemModelTask) {
          doc.text(this.itemModel.title, 42, 25);
          doc.text(this.itemModelTask.secondTitle, 42, 33);
          doc.text(this.itemModelTask.description, 42, 41);
        }
        doc.output("dataurlnewwindow");
      }
    });
    newTaf = null;
  }

  setTaskIndex(index: number) {
    this.currentTaskIndex = index;
  }

  nextTask() {
    this.currentTaskIndex++;
  }

  previousTask() {
    this.currentTaskIndex--;
  }

  // first observable holds task and dialog data, second dialog holds project data
  onAddItem(): void {
    const auxOne = this.dialogResponse(
      environment.addTaskTitle,
      ItemType.AddTask
    );
    const auxTwo = this.taskService.getCurrentProjectSubject();
    combineLatest([auxOne, auxTwo])
      .pipe(take(1))
      .subscribe((value) => {
        if (value[0].dialog.isDialogSubmitted) {
          this.taskService.addItem(value[1], value[0].item);
          this.uiService.showSnackbar(
            SnackbarType.SUCCESS,
            environment.taskSuccessfullyAdded,
            SnackbarTime.LONG
          );
        }
      });
  }

  onRemoveItem(itemId: string): void {
    const auxOne = this.dialogResponse(
      environment.removeTaskTitle,
      ItemType.RemoveTask
    );
    const auxTwo = this.taskService.getCurrentProjectSubject();

    combineLatest([auxOne, auxTwo])
      .pipe(take(1))
      .subscribe((value) => {
        if (value[0].dialog.isDialogSubmitted) {
          this.taskService.removeItem(value[1].id, itemId);
          this.uiService.showSnackbar(
            SnackbarType.SUCCESS,
            environment.taskSuccessfullyRemoved,
            SnackbarTime.LONG
          );
        }
      });
  }

  async onDuplicate(task: Task, index): Promise<void> {
    let newTaf = new Task(new Date());

    newTaf.description = task.description;
    newTaf.secondTitle = task.secondTitle;

    this.taskService.getCurrentProjectSubject().subscribe((e) => {
      if (newTaf != null) {
        e.tasks.splice(index + 1, 0, newTaf);
      }
      this.uiService.showSnackbar(
        SnackbarType.SUCCESS,
        environment.taskSuccessfullyDuplicated,
        SnackbarTime.LONG
      );
      newTaf = null;
    });
  }
  // onSortTask(task: Task): void{
  //   return
  // }
}
