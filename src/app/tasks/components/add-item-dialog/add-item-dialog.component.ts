import { Component, ElementRef, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AddItemDialogModel } from "./add-item-dialog.model";
import { Project, Task } from "../../data/task.model";
import { ItemType } from "../../core/base/ItemType";
import { UserInterfaceService } from "../../services/user-interface.service";
import { SnackbarType } from "../../utils/handlers/SnackbarType";
import { environment } from "../../../../environments/environment.prod";
import { SnackbarTime } from "../../utils/handlers/SnackbarTime";
import { FloatButtonComponent } from "../float-button/float-button.component";

@Component({
  selector: "app-add-item-dialog",
  templateUrl: "./add-item-dialog.component.html",
})
export class AddItemDialogComponent implements OnInit {
  public dialogModel: AddItemDialogModel;
  public itemModel: Project | Task;
  public itemModelTask: Task;
  // Instance is passed from parent(where this component is invoked as dialog)
  public uiService: UserInterfaceService;

  constructor(
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.dialogModel = data.dialog;
    this.instantiateModel(data);
  }

  print(obj: any) {
    return JSON.stringify(obj);
  }

  ngOnInit(): void {
    if (this.itemModel instanceof Project) {
      this.dialogRef.updateSize("1600px", "");
    }
  }

  public addAnotherTask(indexS: any): void {
    if (this.itemModel instanceof Project) {
      if (!this.itemModel.tasks) {
        this.itemModel.tasks = [];
      }
      let index = Number(indexS);

      const newTask = new Task(new Date());
      this.itemModel.tasks.splice(index + 1, 0, newTask);
    }
  }

  public addNewTask(): void {
    if (this.itemModel instanceof Project) {
      if (!this.itemModel.tasks) {
        this.itemModel.tasks = [];
      }
      const newTask = new Task(new Date());
      this.itemModel.tasks.push(newTask);
    }
  }

  public emptyTasks(): void {
    if (this.itemModel instanceof Project) {
      this.itemModel.tasks.splice(0, this.itemModel.tasks.length);
    }
  }

  public deleteTask(itemID: any): void {
    if (this.itemModel instanceof Project) {
      let newId = Number(itemID);
      if (this.itemModel.tasks.length >= 1) {
        this.itemModel.tasks.splice(newId, 1);
      }
    }
  }

  public sortTasks(): void {
    if (this.itemModel instanceof Project) {
      this.itemModel.tasks.sort((a, b) =>
        a.secondTitle.localeCompare(b.secondTitle)
      );
    }
  }

  private instantiateModel(data) {
    if (data.type === ItemType.AddProject) {
      this.itemModel = new Project();
      this.itemModel.tasks = [];

      const task = new Task(new Date());
      this.itemModel.tasks.push(task);
    } else if (data.type === ItemType.AddTask) {
      this.itemModel = new Task(new Date());
      this.itemModelTask = this.itemModel;
    }
  }

  public onAccept(): FloatButtonComponent {
    if (
      this.itemModelTask !== undefined &&
      (this.itemModelTask.secondTitle === "" ||
        this.itemModelTask.description === "")
    ) {
      this.uiService.showSnackbar(
        SnackbarType.WARNING,
        environment.noTaskInput,
        SnackbarTime.LONG
      );
      return;
    }
    if (this.itemModel instanceof Project) {
      for (let task of this.itemModel.tasks) {
        if (
          this.itemModel.title === "" &&
          (task.secondTitle === "" || task.description === "")
        ) {
          this.uiService.showSnackbar(
            SnackbarType.WARNING,
            environment.noDialogInput,
            SnackbarTime.LONG
          );
          return;
        }
        if (
          this.itemModel.title !== "" &&
          (task.secondTitle === "" || task.description === "")
        ) {
          this.uiService.showSnackbar(
            SnackbarType.WARNING,
            environment.noTaskInput,
            SnackbarTime.LONG
          );
          return;
        }
      }
      if (this.itemModel.tasks.length < 1 && this.itemModel.title === "") {
        this.uiService.showSnackbar(
          SnackbarType.WARNING,
          environment.noProjectInput,
          SnackbarTime.LONG
        );
        return;
      }
    }
    this.closeDialog(true);
  }

  public onDismiss(): void {
    this.closeDialog(false);
  }

  private closeDialog(isSubmitted: boolean): void {
    this.dialogModel.isDialogSubmitted = isSubmitted;
    this.dialogRef.close({
      dialog: this.dialogModel,
      item: this.itemModel,
    });
  }
}
