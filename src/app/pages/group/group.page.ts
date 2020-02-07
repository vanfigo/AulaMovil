import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GroupsService} from '../../services/groups.service';
import {SchoolYearsService} from '../../services/school-years.service';
import {Group} from '../../models/group.class';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {

  loading = true;

  constructor(private activatedRoute: ActivatedRoute,
              public groupsService: GroupsService,
              private schoolYearsService: SchoolYearsService) {
    schoolYearsService.schoolYearUid = activatedRoute.snapshot.params.schoolYearUid;
    groupsService.findByUid(activatedRoute.snapshot.params.uid)
      .toPromise().then((group: Group) => {
      groupsService.group = group;
      this.loading = false;
    });
  }


  ngOnInit() {
  }

}
