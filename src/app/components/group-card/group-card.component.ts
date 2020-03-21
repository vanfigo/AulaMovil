import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Group} from '../../models/group.class';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss'],
})
export class GroupCardComponent implements OnInit {

  @Input() group: Group;
  @Input() actions = true;
  @Output() groupSelected = new EventEmitter<Group>();
  @Output() editGroup = new EventEmitter<Group>();
  @Output() deleteGroup = new EventEmitter<Group>();

  constructor() { }

  ngOnInit() {}

}
