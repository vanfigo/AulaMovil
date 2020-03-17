import {Injectable} from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular';
import {FileType} from '../models/file-type.class';
import {AuthService} from './auth.service';
import {Plugins} from '@capacitor/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  fileFormat = 'YYYY-MM-DD HH-mm-ss';

  constructor(private authService: AuthService,
              private loadingController: LoadingController,
              private toastController: ToastController) { }

  generateAndShareFile = (fileType: FileType, fileContent: string) => {
    Plugins.FileSharer.share({
      filename: `${fileType.name} ${moment().format(this.fileFormat)}.${fileType.extension}`,
      base64Data: btoa(fileContent),
      contentType: 'text/csv'
    }).then(console.log)
      .catch(console.error);
  }

  showToastError = (error: any) => {
    this.toastController.create({
      message: error,
      duration: 3000,
      color: 'danger'
    }).then(toast => toast.present());
  }

}
