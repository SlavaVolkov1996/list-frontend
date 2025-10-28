import {Component, OnInit, Inject} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogComponent} from "../dialog/dialog.component";
import {TodoListService} from "../todo-list.service";


/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
export interface Entry {
  title: string;
  entries?: Entry[];
}


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  treeData: Entry[] = [];
  error: any = null;
  errorJson: any = null;
  treeControl = new NestedTreeControl<Entry>(node => node.entries);
  dataSource: any = new MatTreeNestedDataSource<Entry>();

  constructor(public dialog: MatDialog, private todoListService: TodoListService) {
    this.dataSource.data = this.treeData;
  }

  hasChild = (_: number, node: Entry) => !!node.entries && node.entries.length > 0;

  openDialog(node: Entry | null): void {
    if (node != null) {
      this.treeControl.expand(node);
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {name: ''},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      if (node === null) {
        node = {title: result}
        this.treeData.push(node);
      } else {
        if (!node.entries) {
          node.entries = [];
        }
        node.entries.push({title: result});
      }
      this.dataSource.data = null;
      this.dataSource.data = this.treeData;
      this.treeControl.expand(node);
      this.todoListService.saveEntries(this.treeData).subscribe();
    });
  }

  ngOnInit(): void {
    this.todoListService.getEntries().subscribe(
      (res) => {
        this.treeData = res;
        this.dataSource.data = null;
        this.dataSource.data = this.treeData;
      },
      error => {
        this.error = error;
        this.errorJson = error.message;
      }
    )
  }
}
