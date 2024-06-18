import { STORE_LOCAL_STORAGE_KEY } from '../config';

class AppState {
  public static instance?: AppState;
  
  private localStorageKey: string;

  private constructor(localStorageKey: string) {
    this.localStorageKey = localStorageKey;
  }

  public static getInstance() {
    if (!AppState.instance) {
      AppState.instance = new AppState(STORE_LOCAL_STORAGE_KEY);
    }
    return AppState.instance;
  }

  public serialize() {
    throw new Error('NOT_IMPLEMENTED');
  }

  public static deserialize(str: string) {
    return JSON.parse(JSON.parse(str)._persist);
  }

  public getStoreVersion() {
    const store = this.getStore();

    return store ? AppState.deserialize(store).version : null;
  }

  public getStore() {
    return localStorage.getItem(this.localStorageKey);
  }

  public setStore(storeAsString: string) {
    localStorage.setItem(this.localStorageKey, storeAsString);
  }

  public reset() {
    console.warn(`Erasing persisted app store of local storage...`);

    localStorage.removeItem(this.localStorageKey);
  }
}

export default AppState.getInstance();