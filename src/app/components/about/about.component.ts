import {Component, ViewChild} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {IonSlides, ModalController} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  showSkip = true;
  showForward = true;
  showDone = false;
  slideSub: Subscription;

  constructor(private storageService: StorageService,
              private modalController: ModalController) { }

  ionViewDidLeave() {
    this.slideSub.unsubscribe();
  }

  async ionViewWillEnter() {
    await this.slides.update();
    const slidesLength = await this.slides.length();
    this.slideSub = this.slides.ionSlideDidChange.subscribe((slide) => {
      this.slides.getActiveIndex().then(async index => {
        this.showSkip = index < slidesLength - 1;
        this.showDone = index === slidesLength - 1;
        this.showForward = !this.showDone;
      });
    });
  }

  dismissAboutComponent = () => this.modalController.dismiss().then(() =>
    this.storageService.set('hideLandingPage', true))

}
