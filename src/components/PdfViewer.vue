<!-- <template>
	<div>
		{{currentPage}} / {{pageCount}}
		<pdf
			src=".\summons_complaints.pdf"
			@num-pages="pageCount = $event"
			@page-loaded="currentPage = $event"
		></pdf>
	</div>
</template>

<script>

import pdf from 'vue-pdf'

export default {
    name: 'pdf-viewer',
	components: {
		pdf
	},
	data() {
		return {
			currentPage: 0,
			pageCount: 0,
		}
	}
}

</script> -->
<template>
  <div id="pageContainer" style="display: flex; justify-content: center">
    <!-- <pdf v-for="i in numPages" :key="i" :src="src" :page="i"></pdf> 
    <iframe :src="src" width="100%" height="490" />
    <pdf
      v-for="i in numPages"
      :id="i"
      :key="i"
      :src="src"
      :page="i"
      :scale.sync="scale"
    >
      <template slot="loading">
        loading content here...
      </template>
    </pdf>-->

    <div id="viewer" class="pdfViewer" />
  </div>
</template>

<script>
// import pdf from "pdfvuer";

// //var loadingTask = pdf.createLoadingTask('./summons_complaints.pdf');

// export default {
//   components: {
//     pdf,
//   },
//   props: {
//     pdf: String,
//     src: String,
//   },
//   data() {
//     return {
//       //src: loadingTask,
//       numPages: undefined,
//       loadedSrc: undefined,
//     };
//   },
//   mounted() {
//     pdf.createLoadingTask(this.src).promise.then((pdf) => {
//       this.numPages = pdf._pdfInfo.numPages;
//       this.loadedSrc = pdf;
//     });
//   },
// };

// import pdfvuer from "pdfvuer";
// import "pdfjs-dist/build/pdf.worker.entry"; // To be uncommented if you get error: Error: Setting up fake worker failed: "window.pdfjsWorker is undefined".
import pdfjsLib from "pdfjs-dist/build/pdf";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
let container = null;
let pdfViewer = null;

export default {
  props: {
    src: {
      type: String,
      default: "",
    },
  },
  // computed: {
  //   formattedZoom() {
  //     return Number.parseInt(this.scale * 100);
  //   },
  // },
  // watch: {
  //   scaleProp: function (newVal) {
  //     this.scale = newVal;
  //   },
  //   show: function (s) {
  //     if (s) {
  //       this.getPdf();
  //     }
  //   },
  //   page: function (p) {
  //     if (
  //       window.pageYOffset <= this.findPos(document.getElementById(p)) ||
  //       (document.getElementById(p + 1) &&
  //         window.pageYOffset >= this.findPos(document.getElementById(p + 1)))
  //     ) {
  //       // window.scrollTo(0,this.findPos(document.getElementById(p)));
  //       document.getElementById(p).scrollIntoView();
  //     }
  //   },
  // },
  mounted() {
    if (document.getElementById("pageContainer")) {
      this.getPdf();
    }
  },
  created() {
    window.addEventListener("resize", this.watchWindow);
  },
  destroyed() {
    window.removeEventListener("resize", this.watchWindow);
  },
  methods: {
    watchWindow() {
      const width = window.innerWidth;
      const newScale = (width - 100) / 100 / 10;
      if (width < 766) pdfViewer.currentScaleValue = newScale;
    },
    async getPdf() {
      if (this.src === "data:application/pdf;base64,undefined")
        return console.error("pdf src is currupt:", this.src);

      try {
        container = document.getElementById("pageContainer");
        pdfViewer = new PDFViewer({
          container: container,
          removePageBorders: true,
          // textLayerMode: 0,
        });
        const loadingTask = pdfjsLib.getDocument(this.src);
        const pdf = await loadingTask.promise;
        pdfViewer.setDocument(pdf);
        pdfViewer.currentScaleValue = 0.65;
      } catch (error) {
        // console.log("getPdf error:", error);
      }
    },
    // getPdf() {
    //   var self = this;
    //   self.pdfdata = pdfvuer.createLoadingTask(this.src);
    //   self.pdfdata.then((pdf) => {
    //     self.numPages = pdf.numPages;
    //     window.onscroll = function () {
    //       changePage();
    //     };

    //     function changePage() {
    //       var i = 1,
    //         count = Number(pdf.numPages);
    //       do {
    //         if (
    //           window.pageYOffset >= self.findPos(document.getElementById(i)) &&
    //           window.pageYOffset <= self.findPos(document.getElementById(i + 1))
    //         ) {
    //           self.page = i;
    //         }
    //         i++;
    //       } while (i < count);
    //       if (window.pageYOffset >= self.findPos(document.getElementById(i))) {
    //         self.page = i;
    //       }
    //     }
    //   });
    // },
    // findPos(obj) {
    //   return obj.offsetTop;
    // },
  },
};
</script>
<style src="pdfjs-dist/web/pdf_viewer.css"></style>
<style>
.pdfViewer.removePageBorders .page {
  border: 1px solid #e3e3e3;
}
</style>
