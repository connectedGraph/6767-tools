var elDatePickerExtend = {
  props: {
    modelValue: {
      type: String
    },
    label: {
      type: String
    },
    type: {
      type: String,
      default: "date"
    },
    readonly: {
      type: String,
      default: false
    },
    format: {
      type: String,
      default: "YYYY.MM.DD"
    },
    disabledDate: {
      type: Object
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
  template: "\n        <div class=\"el-input-extend el-date-picker-extend\">\n            <el-date-picker v-model=\"value\" v-on:focus=\"focus\" v-on:blur=\"blur\" v-on:clear=\"clear\" :type=\"type\" :disabled-date=\"disabledDate\" placeholder=\" \" :format=\"format\" class=\"w100\" />\n            <span class=\"label\" :class=\"labelClass\">{{label}}</span>\n        </div>\n    ",
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
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
      if (!c.isNullOrEmpty(this.value) || this.isFocus) {
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