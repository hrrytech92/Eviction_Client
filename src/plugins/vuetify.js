import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@/styles.sass";
import Tasks from "@/components/icons/Tasks.vue";
import Settings from "@/components/icons/Settings.vue";
import Calendar from "@/components/icons/Calendar.vue";
import Pencil from "@/components/icons/Pencil.vue";
import Office from "@/components/icons/Office.vue";
import Phone from "@/components/icons/Phone.vue";
import Cellphone from "@/components/icons/Cellphone.vue";
import Email from "@/components/icons/Email.vue";
import Invoices from "@/components/icons/Invoices.vue";
import Megaphone from "@/components/icons/Megaphone.vue";
import CircleCheckmark from "@/components/icons/CircleCheckmark.vue";
import SearchFolder from "@/components/icons/SearchFolder.vue";
import Form from "@/components/icons/Form.vue";
import Bank from "@/components/icons/Bank.vue";
import DocumentFolder from "@/components/icons/DocumentFolder.vue";
import ArrowUp from "@/components/icons/ArrowUp.vue";
import Download from "@/components/icons/Download.vue";
import { ClickOutside } from "vuetify/lib/directives";

Vue.use(Vuetify, {
  directives: {
    ClickOutside,
  },
});

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#4DCCC4",
        secondary: "#003A60",
        secondary_light: "#53809D",
        accent: "#F86624",
        accent_light: "#FF854E",
        accent2: "#6A7FDB",
        info: "#AFC2CE",
        info_light: "#DAE3E9",
        extra: "#F8C1CB",
        alert: "#FA7274",
        blueish: "#45677d",
        blue_grey: "#93AEBF",
        background_grey: "#FAFBFC",
        grey_light: "#F0F5F6",
        slim: "#1E5273",
        white: "#fff",
        grey: "#8BA4B4",
      },
    },
  },
  icons: {
    values: {
      tasks: {
        // name of our custom icon
        component: Tasks, // our custom component
      },
      settings: {
        component: Settings,
      },
      calendar: {
        component: Calendar,
      },
      pencil: {
        component: Pencil,
      },
      office: {
        component: Office,
      },
      phone: {
        component: Phone,
      },
      cellphone: {
        component: Cellphone,
      },
      email: {
        component: Email,
      },
      invoices: {
        component: Invoices,
      },
      megaphone: {
        component: Megaphone,
      },
      searchFolder: {
        component: SearchFolder,
      },
      bank: {
        component: Bank,
      },
      form: {
        component: Form,
      },
      documentFolder: {
        component: DocumentFolder,
      },
      download: {
        component: Download,
      },
      circleCheckmark: {
        component: CircleCheckmark,
      },
      arrowup: {
        component: ArrowUp,
      },
    },
  },
});
