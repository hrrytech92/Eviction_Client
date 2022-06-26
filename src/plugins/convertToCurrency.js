export default {
  install(Vue) {
    Vue.prototype.convertToCurrency = (amount) => {
      if (!amount) return "$0.00";
      if (typeof amount === "string") {
        amount = parseFloat(amount.replace(/,/g, ""));
      }
      return (
        "$" + amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
      );
    };
  },
};
