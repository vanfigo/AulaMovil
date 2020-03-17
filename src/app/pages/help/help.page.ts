import {Component, OnInit} from '@angular/core';
// @ts-ignore
import helpMenu from '../../../assets/json/help.json';
import {HelpEntry} from '../../models/help-entry.class';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  data: HelpEntry[] = helpMenu;

  constructor() { }

  ngOnInit() {
  }

}
