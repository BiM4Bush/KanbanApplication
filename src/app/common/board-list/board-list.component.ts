import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BoardService } from '../../services/board.service';

export interface DialogData {
  desc: string;
  name: string;
  limit: number;
}

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit, OnDestroy {
  boards: Board[];
  sub: Subscription;

  public isHandSet$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public boardService: BoardService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sub = this.boardService.getUserBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  //Drag and drop dla kolumn (możemy przenosić kolumny w inne miejsce)
  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
      this.boardService.sortBoards(this.boards);
    }
  }
//Okno do nowej kolumny
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '375px',
      closeOnNavigation: true,
      hasBackdrop: true,
      panelClass: 'dialog',
      data: { limit: '0', name: 'Kolumna ' + (this.boards.length + 1), desc: '' ,},
      
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result) {
        this.boardService.createBoard({
          title: result.name,
          tasks: [],
          priority: this.boards.length,
          limit: result.limit
        });
      }
    });
  }
  //Usuń kolumne
  deleteBoard(boardId: string): void {
    this.boardService.deleteBoard(this.boards, boardId);
  }
}

@Component({
  selector: 'app-create-board-dialog',
  templateUrl: 'create-board.html',
})
export class DialogOverviewComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
