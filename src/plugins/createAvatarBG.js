export default {
  install(Vue) {
    Vue.prototype.createAvatarBackgroundColor = (str) => {
      if (str) {
        const letterIndex = str.charCodeAt() - 64;
        const hue = (360 / 26) * letterIndex;
        return `hsl(${hue}, 68%, 48%)`;
      }
      return "";
    };
  },
};
