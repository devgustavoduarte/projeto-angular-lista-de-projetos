import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TasksComponent } from "../tasks.component";
import { TaskService } from "../../services/task.service";

@Component({
  selector: "app-star-rating",
  templateUrl: "./star-rating.component.html",
  styleUrls: ["./star-rating.component.sass"],
})
export class StarRatingComponent extends TasksComponent implements OnInit {
  public stars: any[] = [];

  public result: number = 0;

  @Input() public model: number = 0;

  @Output() public modelChange = new EventEmitter();

  @Output() public value: number = this.value;

  @Input() public size: number = 0;

  constructor(public taskService: TaskService) {
    super(taskService);
  }

  ngOnInit(): void {
    if (this.model % 1 < 0.5) {
      this.model = Math.floor(this.model);
    } else if (this.model % 1 > 0.5) {
      this.model = Math.ceil(this.model);
      // this.modelChange.next(this.model);
    }

    if (this.value > this.size) {
      this.model = 0;
    }

    this.result = this.model;

    this.stars = Array(Math.floor(this.size)).fill(0);

    this.stars.splice(0, this.size);

    for (let e = 0; e < this.model; e++) {
      this.stars.push(1);
    }

    if (this.model % 1 === 0.5) {
      this.stars[this.model - 0.5] = 0.5;
    }

    while (this.stars.length < this.size) {
      this.stars.push(0);
    }
  }

  RatingStars(index: number) {
    if (this.stars.includes(0.5)) {
      let halfStar = this.stars.indexOf(0.5);
      this.stars[halfStar] = 1;
      this.calculateRating(index);
      console.log(this.stars);

      if (index === halfStar) {
        return this.stars;
      }
    } else {
      let lastStar = this.stars.lastIndexOf(1);
      if (index === lastStar) {
        this.stars[lastStar] = 0;
        console.log(this.stars);
        this.calculateRating(index);
        return this.stars;
      }
    }

    this.stars.splice(0, this.size);

    for (let e = 0; e < index; e++) {
      this.stars.push(1);
    }

    this.stars[index] = 0.5;
    console.log(this.stars);

    if ((this.stars[index] = 0.5)) {
      this.result = index + 0.5;
    }

    while (this.stars.length < this.size) {
      this.stars.push(0);
    }

    this.calculateRating(index);
  }

  calculateRating(index: number) {
    for (let i = 0; i <= index; i++) {
      this.result = this.stars[index] + index;
    }

    this.modelChange.next(this.result);
  }
}
