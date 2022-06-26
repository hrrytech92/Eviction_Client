import pdfmake from "pdfmake/build/pdfmake.js";
// import vfsFonts from '@/vfs_fonts.js';
export default {
  install(Vue) {
    // const { vfs } = vfsFonts.pdfMake;
    // pdfmake.vfs = vfs;
    pdfmake.fonts = {
      // All 4 components must be defined
      TimesNewRoman: {
        normal: "Times-Regular.ttf",
        bold: "Times-Bold.ttf",
        italics: "Times-Italic.ttf",
        bolditalics: "Times-BoldItalic.ttf",
      },
    };
    Vue.prototype.$pdfmake = pdfmake;
  },
};
