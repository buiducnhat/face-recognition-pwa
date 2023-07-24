import { action, computed, makeObservable, observable } from 'mobx';

type TThemeType = 'wireframe' | 'light' | 'winter' | 'dark' | 'dracula';

class ThemeStore {
  @observable themeType: TThemeType = 'winter';

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setThemeType(themeType: TThemeType) {
    this.themeType = themeType;
  }

  @computed
  get isDarkTheme() {
    return ['dark', 'dracula'].includes(this.themeType);
  }
}

export default ThemeStore;
