import {CdkDragDrop,moveItemInArray, transferArrayItem, CdkDrag, CdkDropList} from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() board: Board;
  @Output() deleteBoard = new EventEmitter<string>();
  public limity:number;
  public canEdit = false;
  public filteredList: Array<Array<Task>>;
  public newBoardTitle: string;

  movementCount: number = 0;
  public newBoardLimit: number;

  //Drag and drop do tasków
  constructor(public boardService: BoardService, public dialog: MatDialog) {}
  taskDrop(event: CdkDragDrop<Board>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data.tasks,
        event.previousIndex,
        event.currentIndex
      );
      this.boardService.updateTasks(
        event.container.data.id,
        event.container.data.tasks
      );
    }
     else {
      transferArrayItem(
        event.previousContainer.data.tasks,
        event.container.data.tasks,
        event.previousIndex,
        event.currentIndex
      );
      this.boardService.updateTasks(
        event.container.data.id,
        event.container.data.tasks
      );
      this.boardService.updateTasks(
        event.previousContainer.data.id,
        event.previousContainer.data.tasks
      );
    }
  }


 

  //////
  //Usuń kolumne
  deleteBorad(): void {
    this.deleteBoard.emit(this.board.id);
  }

  //Tworzenie zadań/tasków
  openDialog(task?: Task, idx?: number): void {
    const dialogRef = this.dialog.open(TaskDialogOverviewComponent, {
      width: '375px',
      closeOnNavigation: true,
      hasBackdrop: true,
      panelClass: 'dialog',
      data: task
        ? { task: { ...task }, isNew: false, idx, boardId: this.board.id }
        : { task: { description: '', label: 'yellow' } as Task, isNew: true },
    });
    dialogRef
      .afterClosed()
      .subscribe(
        (result: {
          task: Task;
          isNew: boolean;
          boardId: string;
          idx: number;
        }) => {
          if (result) {
            if (result.isNew) {
              this.boardService.updateTasks(this.board.id, [
                ...this.board.tasks,
                result.task,
              ]);
            } else {
              const updated = this.board.tasks;
              updated.splice(idx, 1, result.task);
              this.boardService.updateTasks(result.boardId, updated);
            }
          }
        }
      );
  }
  //Edytuj tablice
  makeTitleEditable(): void {
    this.canEdit = true;
    this.newBoardTitle = this.board.title;
    this.newBoardLimit = this.board.limit;
  }
  //Updade
  updateBoardTitle(): void {
    this.boardService.updateBoardTitle(this.board.id, this.newBoardTitle, this.newBoardLimit);
  }
  closeEditOpt(): void {
    this.canEdit = false;
    this.newBoardTitle = '';
  }
}

@Component({
  selector: 'app-task-create-board-dialog',
  templateUrl: './create-task.html',
})
export class TaskDialogOverviewComponent {
  labelOptions = ['green', 'red', 'blue', 'yellow', 'pink'];
  constructor(
    public boardService: BoardService,
    public dialogRef: MatDialogRef<TaskDialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { task: Task; boardId: string; isNew: boolean; idx: number }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  //Usuwanie taska
  deleteTask(): void {
    this.boardService.removeTask(this.data.boardId, this.data.task);
    this.dialogRef.close();
  }
}
