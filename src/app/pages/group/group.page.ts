import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GroupsService} from '../../services/groups.service';
import {Group} from '../../models/group.class';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage {

  loading = true;

  constructor(public groupsService: GroupsService,
              private activatedRoute: ActivatedRoute) {
    const groupUid = activatedRoute.snapshot.params.uid;
    groupsService.findByUid(groupUid).subscribe((group: Group) => {
        groupsService.group = group;
        this.loading = false;
      });
  }

}
