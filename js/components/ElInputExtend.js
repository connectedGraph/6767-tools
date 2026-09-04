var elInputExtend = {
  props: {
    modelValue: {
      type: String
    },
    label: {
      type: String
    },
    type: {
      type: String,
      default: "text"
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      changeIndex: 0,
      isFocus: false,
      labelClass: ""
    };
  },
  template: "\n        <div class=\"el-input-extend\">\n            <el-input :type=\"type\" v-model=\"value\" v-on:focus=\"focus\" v-on:blur=\"blur\" v-on:clear=\"clear\" size=\"large\" :readonly=\"readonly\" class=\"w100\"></el-input>\n            <span class=\"label\" :class=\"labelClass\">{{label}}</span>\n        </div>\n    ",
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      }
    }
  },
  watch: {
    value() {
      this.setLabelClass();
    }
  },
  mounted: function () {
    this.blur();
  },
  methods: {
    setLabelClass() {
      if (this.value != null && String(this.value) != "" || this.isFocus) {
        this.labelClass = "totop " + (this.isFocus ? "focus" : "");
      } else {
        this.labelClass = "";
      }
    },
    focus() {
      this.isFocus = true;
      this.setLabelClass();
      this.$emit("focus");
    },
    blur() {
      this.isFocus = false;
      this.setLabelClass();
      this.$emit("blur");
    },
    clear() {
      this.setLabelClass();
      this.$emit("clear");
    }
  }
};