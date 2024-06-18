import { STORE_LOCAL_STORAGE_KEY } from '../config';

class AppStore {
  public static instance?: AppStore;
  
  private key: string;

  private constructor(key: string) {
    this.key = key;
  }

  public static getInstance() {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore(STORE_LOCAL_STORAGE_KEY);
    }
    return AppStore.instance;
  }

  public serialize() {
    return this.getStoreAsString();
  }

  public static deserialize(str: string) {
    return JSON.parse(str);
  }

  public getStoreVersion() {
    const store = this.getStore();

    return store ? store._persist.version : null;
  }

  public getStore() {
    const storeAsString = this.getStoreAsString();

    return storeAsString ? AppStore.deserialize(storeAsString) : null;
  }

  private getStoreAsString() {
    return localStorage.getItem(this.key);
  }

  public reset() {
    console.warn(`Erasing persisted app store of local storage...`);

    localStorage.removeItem(this.key);
  }
}

export default AppStore.getInstance();