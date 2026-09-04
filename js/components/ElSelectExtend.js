var elSelectExtend = {
  props: {
    modelValue: {
      type: String
    },
    label: {
      type: String
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
  template: "\n        <div class=\"el-input-extend\">\n            <el-select v-model=\"value\" v-on:change=\"change\" v-on:focus=\"focus\" v-on:blur=\"blur\" v-on:clear=\"clear\" placeholder=\" \" size=\"large\" class=\"w100\">\n                <slot></slot>\n            </el-select>\n            <span class=\"label\" :class=\"labelClass\">{{label}}</span>\n        </div>\n    ",
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
      if (!c.isNullOrEmpty(this.value)) {
        this.labelClass = "totop ";
      } else {
        this.labelClass = "";
      }
      this.labelClass += this.isFocus ? "focus" : "";
    },
    change() {
      this.setLabelClass();
      this.$emit("change");
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