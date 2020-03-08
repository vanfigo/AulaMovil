import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {IonSlides, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  hideLandingPage: boolean;
  showBack: boolean;
  showLogIn: boolean;
  showForward: boolean;
  slideSub: Subscription;
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
    this.slides.slideTo(0)
      .then(() => {
        this.showBack = false;
        this.showLogIn = false;
        this.showForward = true;
      });
    const slidesLength = await this.slides.length();
    this.storageService.get('hideLandingPage').then((hide) => this.hideLandingPage = !!hide);
    this.slideSub = this.slides.ionSlideDidChange.subscribe((slide) => {
      this.slides.getActiveIndex().then(async index => {
        this.showBack = index > 0;
        this.showLogIn = index === slidesLength - 1;
        this.showForward = !this.showLogIn;
      });
    });
  }

  ionViewDidLeave() {
    this.slideSub.unsubscribe();
  }

  ngOnInit() { }

  updateViewLanding = (event: CustomEvent) => this.storageService.set('hideLandingPage', event.detail.checked);

  navigateToLogin = () => this.navController.navigateForward('/login', { relativeTo: this.activatedRoute });

}
