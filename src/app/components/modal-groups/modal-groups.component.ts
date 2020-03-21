import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {GroupsService} from '../../services/groups.service';
import {Group} from '../../models/group.class';

@Component({
  selector: 'app-modal-groups',
  templateUrl: './modal-groups.component.html',
  styleUrls: ['./modal-groups.component.scss'],
})
export class ModalGroupsComponent implements OnInit {

  groupsBySchoolYear: {
    schoolYear: string,
    groups: Group[]
  }[] = [];

  constructor(public modalController: ModalController,
              private groupsService: GroupsService) {
    this.groupsService.findAll().toPromise().then((groups: Group[]) => {
      groups.forEach(group => {
        const groupBySchoolYear = this.groupsBySchoolYear.find(schoolYear => schoolYear.schoolYear === group.schoolYear);
        if (groupBySchoolYear) {
          groupBySchoolYear.groups?.push(group);
        } else {
          this.groupsBySchoolYear.push({ schoolYear: group.schoolYear, groups: [group] });
        }
      });
    });
  }

  ngOnInit() {}

  selectGroup = (group: Group) => this.modalController.dismiss(group);

}
