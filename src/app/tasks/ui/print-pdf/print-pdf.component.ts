import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { PrintPdf } from '../../core/PrintPdfItem';

@Component({
  selector: 'app-print-pdf',
  templateUrl: './print-pdf.component.html',
  styleUrls: ['./print-pdf.component.sass']
})
export class PrintPdfComponent implements  PrintPdf {

  constructor(public readonly taskService: TaskService,) { }


  printPdf() {

  }

}
