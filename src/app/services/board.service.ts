import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import {} from '@angular/fire/firestore/public_api';
import * as firebase from 'firebase/app';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  //Utworz kolumne i pierwszego taska
  async createBoard(data: Board): Promise<DocumentReference<Board>> {
    const user = await this.afAuth.currentUser;
    return this.db.collection<Board>('board').add({
      ...data,
      uid: user.uid,
      tasks: [
        {
          label: 'yellow',
          description: 'Dodaj treść do karteczki',
        },
      ],
    } as Board);
  }
  //Usun kolumne
  async deleteBoard(boards: Board[], boardID: string): Promise<void> {
    try {
      const batch = this.db.firestore.batch();
      const refs = boards
        .filter((e) => e.id !== boardID)
        .map((b) => this.db.collection<Board>('board').doc(b.id));
      batch.delete(this.db.collection<Board>('board').doc(boardID).ref);
      refs.forEach((ref, idx) => batch.update(ref.ref, { priority: idx }));
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  }
  //Zmien nazwe kolumny
  updateBoardTitle(boardId: string, boardTitle: string, boardlimit:number): void {
    this.db.collection<Board>('board').doc(boardId).update({
      title: boardTitle,
      limit: boardlimit,
    });
  }
//Update karteczki
  updateTasks(boardId: string, tasks: Task[]): Promise<void> {
    return this.db.collection<Board>('board').doc(boardId).update({
      tasks,
    });
  }
//usun karteczke
  removeTask(boardId: string, task: Task): Promise<void> {
    return this.db
      .collection('board')
      .doc(boardId)
      .update({
        tasks: firebase.default.firestore.FieldValue.arrayRemove(task),
      });
  }
  //Kolumny uzytkownika
  getUserBoards(): Observable<Board[]> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const result = this.db
            .collection('board', (ref) =>
              ref.where('uid', '==', user.uid).orderBy('priority')
            )
            .valueChanges({ idField: 'id' });
          return result;
        } else {
          return [];
        }
      })
    );
  }
  //Sortowanie kolumn
  async sortBoards(boards: Board[]): Promise<void> {
    try {
      const batch = this.db.firestore.batch();
      const refs = boards.map((b) =>
        this.db.collection<Board>('board').doc(b.id)
      );
      refs.forEach((ref, idx) => batch.update(ref.ref, { priority: idx }));
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  }
}
