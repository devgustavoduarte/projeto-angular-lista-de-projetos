import { Component, Input, OnInit, Output, ViewChild } from "@angular/core";
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

@Component({
  selector: "app-task-content",
  templateUrl: "./task-content.component.html",
  styleUrls: ["./task-content.component.sass"],
})
export class TaskContentComponent extends ItemBase<Task> implements OnInit {
  currentTaskIndex;

  dataSource;
  displayedColumns = [];

  @Output()
  public itemModel: Project | Task;
  public itemModelTask: Task;

  public showMyContainer: boolean = false;

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
    this.displayedColumns = this.columnNames.map((x) => x.id);
    this.createTable();
  }

  createTable() {
    let task = new Task(new Date(), "1", "Novo titulo", "", "Descrição");

    let tableArr: Element[] = [
      {
        id: task.id,
        title: task.title,
        description: task.description,
      },
      {
        id: task.id,
        title: task.title,
        description: task.description,
      },
      {
        id: task.id,
        title: task.title,
        description: task.description,
      },
    ];
    this.dataSource = new MatTableDataSource(tableArr);
    this.dataSource.sort = this.sort;
  }

  printPdf(): void {
    let doc = new jsPDF();

    let elementHtml = document.querySelector("#content") as HTMLElement;
    let elementDiv = document.querySelector("#hiddenDiv") as HTMLDivElement;

    // elementDiv.hidden = true;

    const imgData = new Image();
    imgData.src = "../../../../assets/logo.png";

    doc.html(elementHtml, {
      callback: (doc) => {
        // doc.save("test.pdf");
        // doc.addImage(imgData, "png", 140, 130, 150, 150);
        doc.output("dataurlnewwindow");
      },
      x: 13,
      y: 15,
      width: 190,
      windowWidth: 650,
    });
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
}

export interface Element {
  id: any;
  title: string;
  description: string;
}
