import {Injectable} from '@angular/core';
import {Email} from '@teamhive/capacitor-email';
import {LoadingController, ToastController} from '@ionic/angular';
import {FileType} from '../models/file-type.class';
import {FilesystemDirectory, FilesystemEncoding, GetUriResult, Plugins} from '@capacitor/core';
import * as moment from 'moment';
import {AuthService} from './auth.service';

const {Filesystem} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  fileFormat = 'YYYY-MM-DD HH:mm:ss';
  rootFolder = 'Aula-Movil';

  constructor(private authService: AuthService,
              private loadingController: LoadingController,
              private toastController: ToastController) { }

  generateAndShareFile = (fileType: FileType, fileContent: string) => {
    const path = `${this.rootFolder}/${fileType.name}-${moment().format(this.fileFormat)}.${fileType.extension}`;
    Filesystem.requestPermissions().then(async () => {
      const reportLoading = await this.loadingController.create({
        message: `Generando ${fileType.name}...`
      });
      await reportLoading.present();
      Filesystem.writeFile({ directory: FilesystemDirectory.Documents, encoding: FilesystemEncoding.UTF16, path, data: fileContent })
        .then(() => {
          Filesystem.getUri({ directory: FilesystemDirectory.Documents, path })
            .then(async (result: GetUriResult) => {
              await reportLoading.dismiss();
              const email = new Email();
              const hasPermission = await email.hasPermission();
              if (!hasPermission) {
                await email.requestPermission();
              }
              const available = await email.isAvailable({
                alias: 'gmail',
              });
              if (available.hasAccount) {
                await email.open({
                  to: [this.authService.user.email],
                  subject: fileType.name,
                  body: `${fileType.name} generado de manera automatica por Aula-Movil`,
                  isHtml: false,
                  attachments: [result.uri]
                });
              } else {
                this.toastController.create({
                  message: `El archivo fue generado en ${result.uri}`,
                  duration: 3000
                }).then(toast => toast.present());
              }
        }).catch(this.showToastError);
      }).catch(this.showToastError);
    }).catch(this.showToastError);
  }

  showToastError = (error: any) => {
    this.toastController.create({
      message: error,
      duration: 3000,
      color: 'danger'
    }).then(toast => toast.present());
  }

}
