export default (await import('vue')).defineComponent({
name: "CardActions",
props: {
cancelBtnText: {
type: String,
default: "Cancel",
},
saveBtnText: {
type: String,
default: "Save",
},
cancelFunction: {
type: Function,
default: () => { },
},
saveFunction: {
type: Function,
default: () => { },
},
},
//   mounted() {
//     console.log("CardActions mounted");
//     console.log("cancelBtnText:", this.cancelBtnText);
//   },
});
