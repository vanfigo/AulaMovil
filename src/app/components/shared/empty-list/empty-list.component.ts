import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-empty-list',
  templateUrl: './empty-list.component.html',
  styleUrls: ['./empty-list.component.scss'],
})
export class EmptyListComponent implements OnInit {

  @Input() emptyText = 'No se encontraron elementos';
  @Input() displayBadge = false;
  constructor() { }

  ngOnInit() {}

}
