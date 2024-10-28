
import { defineStore } from 'pinia';

export const useAdStore = defineStore('ad', {
  state: () => ({
    adHidden: false,
  }),
  actions: {
    hideAd() {
      this.adHidden = true;
      localStorage.setItem('adHidden', 'true');
    },
    showAd() {
      this.adHidden = false;
      localStorage.removeItem('adHidden');
    },
    initializeAdState() {
      const adHidden = localStorage.getItem('adHidden');
      this.adHidden = adHidden === 'true';
    },
  },
});
