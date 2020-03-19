import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'uriSanitizer'
})
export class UriSanitizerPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {}

  transform(uri: string): any {
    // return this.domSanitizer.bypassSecurityTrustStyle(`url(${uri})`);
    uri = uri || `assets/groupCovers/${Math.floor((Math.random() * 40) + 1)}.jpg`;
    return this.domSanitizer
      .bypassSecurityTrustStyle(`linear-gradient(to left, rgba(0, 0, 0, 0) 40%, rgba(56, 58, 62, 0.7)), url(${uri})`);

  }

}
