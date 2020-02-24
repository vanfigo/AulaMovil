import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set = async (key: string, value: any): Promise<void> => await Storage.set({ key, value: JSON.stringify(value)});

  get = async (key: string): Promise<any> => {
    const item = await Storage.get({ key });
    return JSON.parse(item.value);
  }

  remove = async (key: string): Promise<void> => await Storage.remove({ key });

  clear = async () => await Storage.clear();

}
