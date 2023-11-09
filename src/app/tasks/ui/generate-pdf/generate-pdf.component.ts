import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { TaskService } from "../../services/task.service";
import { PrintPdf } from "../../core/PrintPdfItem";
import { MatCardModule } from "@angular/material/card";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { Project, Task } from "../../data/task.model";

@Component({
  selector: "app-generate-pdf",
  templateUrl: "./generate-pdf.component.html",
  styleUrls: ["./generate-pdf.component.sass"],
})
export class GeneratePdfComponent implements OnInit, PrintPdf {
  @Input()
  public itemModel: Project | Task;
  public itemModelTask: Task;

  dataSource;
  displayedColumns = [];

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
    public readonly cardModule: MatCardModule
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.columnNames.map((x) => x.id);
    if (this.itemModel instanceof Task) {
      this.createTable(this.itemModel["tasks"]);
    }
  }

  createTable(_task: Task) {
    let task = new Task(new Date());

    task.id = _task.id;
    task.secondTitle = _task.secondTitle;
    task.description = _task.description;

    let tableArr: Element[] = [
      {
        id: task.id,
        title: task.secondTitle,
        description: task.description,
      },
    ];
    this.dataSource = new MatTableDataSource(tableArr);
    this.dataSource.sort = this.sort;
  }
  printPdf() {}
}

export interface Element {
  id: any;
  title: string;
  description: string;
}
