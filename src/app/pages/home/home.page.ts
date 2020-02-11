import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {SchoolYear} from '../../models/school-year.class';
import {SchoolYearComponent} from '../../components/school-year/school-year.component';
import {GroupsComponent} from '../../components/groups/groups.component';
import {Storage} from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  schoolYear: SchoolYear;
  @ViewChild(SchoolYearComponent, {static: true}) schoolYearComponent: SchoolYearComponent;
  @ViewChild(GroupsComponent, {static: false}) groupsComponent: GroupsComponent;

  constructor(public authService: AuthService) { }

  ngOnInit() { }

  schoolYearSelected = (schoolYear: SchoolYear) => {
    this.schoolYear = schoolYear;
    this.groupsComponent.selectedSchoolYear(schoolYear);
  }

  async ionViewWillEnter() {
    const schoolYear = await Storage.get({key: 'schoolYear'});
    if (!schoolYear.value) {
      this.groupsComponent.clearGroups();
      this.schoolYearComponent.clearShoolYear();
    }
  }

}
