import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-star-rating",
  templateUrl: "./star-rating.component.html",
  styleUrls: ["./star-rating.component.sass"],
})
export class StarRatingComponent implements OnInit, OnChanges {
  public previousSelected: number = 0;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.stars = Array(Math.floor(this.model)).fill(0);
  }

  @Input()
  public model: number = 5;
  public stars: any[] = [];

  @Input()
  public selectedStar: number = 0;

  HandleMouseEnter(index: number): void {
    this.selectedStar = index + 1;
  }

  HandleMouseLeave(): void {
    if (this.previousSelected !== 0) {
      this.selectedStar = this.previousSelected;
    } else {
      this.selectedStar = 0;
    }
  }

  Rating(index: number): void {
    this.selectedStar = index + 1;
    this.previousSelected = this.selectedStar;
  }
}
