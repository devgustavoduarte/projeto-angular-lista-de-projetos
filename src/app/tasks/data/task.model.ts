export class Project {
  constructor(
    public id: string = new Date().getTime().toString(),
    public title: string = '',
    public secondTitle: string = '',
    public description: string = '',
    public tasks: Task[] = [],) {
  }
}

export class Task {
  constructor(
    public date: Date,
    public id: string = new Date().getTime().toString(),
    public title: string = '',
    public secondTitle: string = '',
    public duplicate: string = '',
    public description: string = '',){
  }
}
