import { Component, Input, OnInit, ViewChild } from "@angular/core";
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
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import autoTable from "jspdf-autotable";

@Component({
  selector: "app-task-content",
  templateUrl: "./task-content.component.html",
  styleUrls: ["./task-content.component.sass"],
})
export class TaskContentComponent extends ItemBase<Task> implements OnInit {
  currentTaskIndex;

  // dataSource;
  // displayedColumns = [];

  @Input()
  public itemModel: Project | Task;
  public itemModelTask: Task;

  @ViewChild(MatSort) sort: MatSort;

  columnNames = [
    {
      id: "id",
      value: "ID",
    },
    {
      id: "title",
      value: "Tarefa",
    },
    {
      id: "description",
      value: "Descrição",
    },
  ];

  constructor(
    public readonly taskService: TaskService,
    public uiService: UserInterfaceService,
    public readonly cardModule: MatCardModule
  ) {
    super(uiService);
  }
  ngOnInit(): void {
    // this.displayedColumns = this.columnNames.map((x) => x.id);
    // this.createTable();
  }

  // createTable() {
  //   this.taskService.getCurrentProjectSubject().subscribe((e) => {
  //     const tableArr = e.tasks
  //       ? e.tasks.map((e) => {
  //           return {
  //             id: e.id,
  //             title: e.secondTitle,
  //             description: e.description,
  //           };
  //         })
  //       : [];

  //     this.dataSource = new MatTableDataSource(tableArr);
  //     this.dataSource.sort = this.sort;
  //   });
  // }

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
    let doc = new jsPDF();

    const imgData = new Image();
    imgData.src = "../../../../assets/logo.png";

    doc.addImage(imgData, "png", 15, 5, 60, 13);
    let taskTitle = this.taskService.getCurrentProjectSubject()["_value"].title;
    doc.text(taskTitle, 102, 35, { align: "center" });
    autoTable(doc, {
      head: this.headRows(),
      headStyles: {
        fontStyle: "bold",
      },
      body: this.bodyRows(),
      margin: { top: 45 },
      styles: {
        font: "helvetica",
        fontSize: 12,
        fontStyle: "normal",
        halign: "center",
      },
    });
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

export interface Element {
  id: string | number;
  title: string;
  description: string;
}
