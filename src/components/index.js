import Vue from "vue";
import InfoDialog from "@/components/dialogs/InfoDialog.vue";
import PhoneField from "@/components/fields/PhoneField.vue";
import SelectField from "@/components/fields/SelectField.vue";
import TextField from "@/components/fields/TextField.vue";
import DateField from "@/components/fields/DateField.vue";
import FormLabel from "@/components/fields/FormLabel.vue";
import LoadingOverlay from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

Vue.component("LoadingOverlay", LoadingOverlay);
Vue.component("InfoDialog", InfoDialog);
Vue.component("PhoneField", PhoneField);
Vue.component("SelectField", SelectField);
Vue.component("TextField", TextField);
Vue.component("DateField", DateField);
Vue.component("FormLabel", FormLabel);
