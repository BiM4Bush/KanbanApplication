import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss'],
})
export class DeleteButtonComponent {
  canDelete: boolean;
  @Output() delete = new EventEmitter<boolean>();
//Wiadomo o co chodzi (kosz do usuwania taskow)
  selectForDelete(): void {
    this.canDelete = true;
  }
  unSelectForDelete(): void {
    this.canDelete = false;
  }

  confirmDelete(): void {
    this.delete.emit(true);
    this.canDelete = false;
  }
}
