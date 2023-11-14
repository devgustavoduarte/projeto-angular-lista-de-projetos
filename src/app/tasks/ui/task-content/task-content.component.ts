import { Component, Input, OnInit } from "@angular/core";
import { TaskService } from "../../services/task.service";
import { Project, Task } from "../../data/task.model";
import { UserInterfaceService } from "../../services/user-interface.service";
import { ItemType } from "../../core/base/ItemType";
import { combineLatest } from "rxjs";
import { SnackbarType } from "../../utils/handlers/SnackbarType";
import { SnackbarTime } from "../../utils/handlers/SnackbarTime";
import { environment } from "../../../../environments/environment.prod";
import { ItemBase } from "../../core/base/ItemBase";
import { take } from "rxjs/operators";
import jsPDF from "jspdf";
import { MatCardModule } from "@angular/material/card";
import autoTable from "jspdf-autotable";

@Component({
  selector: "app-task-content",
  templateUrl: "./task-content.component.html",
  styleUrls: ["./task-content.component.sass"],
})
export class TaskContentComponent extends ItemBase<Task> implements OnInit {
  currentTaskIndex;

  @Input()
  public itemModel: Project | Task;
  public itemModelTask: Task;

  constructor(
    public readonly taskService: TaskService,
    public uiService: UserInterfaceService,
    public readonly cardModule: MatCardModule
  ) {
    super(uiService);
  }
  ngOnInit(): void {}

  headRows() {
    return [{ id: "ID", name: "Nome", description: "Descrição" }];
  }

  bodyRows() {
    let body = [];
    let taskList = this.taskService.getCurrentProjectSubject()["_value"].tasks;

    taskList.forEach((e) => {
      let taskArr = [e.id, e.secondTitle, e.description];
      body.push(taskArr);
    });
    return body;
  }

  printPdf(): void {
    let doc = new jsPDF("p", "mm", "a4");

    let numberOfPages = doc.getNumberOfPages();

    const imgData = new Image();
    imgData.src = "../../../../assets/fabricads-logo/PNG/FabricaDS_120px.png";

    doc.addImage(imgData, "png", 15, 8, 55, 13);
    doc.rect(17, 24, 175, 0, "FD");

    let taskTitle = this.taskService.getCurrentProjectSubject()["_value"].title;
    let tasks = this.taskService.getCurrentProjectSubject()["_value"].tasks[0];

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(19);

    doc.text(taskTitle, 48, 35, { align: "center" });

    doc.setFontSize(12);

    doc.text(tasks.date.toLocaleDateString(), 174, 42, { align: "center" });

    doc.rect(156, 35, 35, 10, "S");

    doc.setFontSize(17);
    doc.text("TABELA DE TAREFAS", 105, 60, { align: "center" });
    doc.rect(17, 65, 175, 0, "FD");

    autoTable(doc, {
      head: this.headRows(),
      headStyles: {
        fontStyle: "bold",
      },
      body: this.bodyRows(),
      startY: 70,
      styles: {
        font: "helvetica",
        fontSize: 12,
        fontStyle: "normal",
        lineWidth: 0.3,
        lineColor: 0,
        halign: "center",
      },
      theme: "striped",
    });

    for (let i = 1; i <= numberOfPages; i++) {
      doc.setPage(i);
      doc.setFontSize(12);
      doc.text(
        "Page " + String(i) + " of " + String(numberOfPages),
        210 - 15,
        297 - 10,
        { align: "right" }
      );
    }

    doc.output("dataurlnewwindow");
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
          this.bodyRows();
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
}
