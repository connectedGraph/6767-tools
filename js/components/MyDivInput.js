var myDivInput = {
  name: "MyDivInput",
  props: {
    modelValue: {
      type: String
    },
    height: {
      type: Number,
      default: 241
    },
    borderWidth: {
      type: Number,
      default: 1
    },
    placeholder: {
      type: String,
      default: ""
    },
    contenteditable: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      text: this.modelValue,
      isLocked: false
    };
  },
  watch: {
    modelValue() {
      if (!this.isLocked) {
        this.text = this.modelValue.replace(/\n/g, "<br>");
      }
    }
  },
  template: "\n        <div class=\"my-div-input\" :contenteditable=\"contenteditable\" v-html=\"text\" :placeholder=\"placeholder\" v-on:focus=\"focus\" v-on:blur=\"blur\" v-on:input=\"input\" :style=\"'height:'+height+'px;border-width:'+borderWidth+'px!important'\"></div>\n    ",
  methods: {
    focus(focusEvent) {
      this.$emit("focus");
      setTimeout(() => {
        this.isLocked = true;
      }, 100);
    },
    blur(blurEvent) {
      this.$emit("blur");
      this.isLocked = false;
    },
    input(inputEvent) {
      const htmlContent = inputEvent.target.innerHTML;
      this.$emit("update:modelValue", htmlContent);
      this.$emit("input");
    }
  }
};