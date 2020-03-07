import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {IonSlides, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  hideLandingPage: boolean;
  slideOpts = {
    slidesPerView: 1,
    autoPlay: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  };

  constructor(private storageService: StorageService,
              private navController: NavController,
              private activatedRoute: ActivatedRoute) {
    storageService.get('hideLandingPage').then((hide) => this.hideLandingPage = !!hide);
  }

  async ionViewWillEnter() {
    await this.slides.slideTo(0);
    this.storageService.get('hideLandingPage').then((hide) => this.hideLandingPage = !!hide);
  }

  ngOnInit() { }

  updateViewLanding = (event: CustomEvent) => this.storageService.set('hideLandingPage', event.detail.checked);

  navigateToLogin = () => this.navController.navigateForward('/login', { relativeTo: this.activatedRoute });

}
