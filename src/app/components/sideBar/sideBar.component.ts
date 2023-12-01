import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sideBar',
  templateUrl: './sideBar.component.html',
  styleUrls: ['./sideBar.component.scss']
})
export class SideBarComponent implements OnInit {
  @Output() changesApplied = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}
