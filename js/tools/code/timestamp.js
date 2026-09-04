function createRegexMatcher(regexPattern) {
  return inputString => !c.isNullOrEmpty(inputString) && regexPattern.test(inputString);
}
window.isUnixTimestamp = createRegexMatcher(/^[0-9]{10}$/);
window.isTimestamp = createRegexMatcher(/^[0-9]{13}$/);
window.isExcelFormat = createRegexMatcher(/^-?\d+(\.\d+)?$/);
window.isTimestampHex = createRegexMatcher(/^([a-fA-F0-9]{11})$/);
Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        time: null,
        localeDate: null,
        utcDate: null,
        jsDate: null,
        isoDate: null,
        rfcDate: null,
        timestamp: null,
        unixTimestamp: null,
        timestampHex: null
      },
      formRules: {
        time: [{
          validator: (rule, value, callback) => {
            var parsedTimestamp;
            if (!c.isNullOrEmpty(value)) {
              if (isUnixTimestamp(value)) {
                value = parseInt(value) * 1000;
              }
              if (isTimestampHex(value)) {
                value = parseInt(value, 16);
              }
              if (isTimestamp(value)) {
                value = parseInt(value);
              }
              parsedTimestamp = moment(value);
              if (!parsedTimestamp || !parsedTimestamp.isValid()) {
                callback(new Error(locales.timeErrTip));
              }
            }
            callback();
          },
          trigger: "blur"
        }]
      }
    };
  },
  mounted() {
    setInterval(() => {
      try {
        var timeProcessResult;
        var timeValue = this.formData.time;
        if (!c.isNullOrEmpty(timeValue)) {
          if (isUnixTimestamp(timeValue)) {
            timeValue = parseInt(timeValue) * 1000;
          }
          if (isTimestampHex(timeValue)) {
            timeValue = parseInt(timeValue, 16);
          }
          if (isTimestamp(timeValue)) {
            timeValue = parseInt(timeValue);
          }
          timeProcessResult = moment(timeValue);
        } else {
          timeProcessResult = moment();
        }
        if (timeProcessResult.isValid()) {
          this.formData.localeDate = languageCode == "zh" ? timeProcessResult.format("YYYY-MM-DD HH:mm:ss") : new Date(timeProcessResult.format("YYYY-MM-DD HH:mm:ss")).toLocaleString();
          this.formData.utcDate = timeProcessResult.utc().format();
          this.formData.jsDate = timeProcessResult.toDate().toString();
          this.formData.isoDate = timeProcessResult.toISOString();
          this.formData.rfcDate = timeProcessResult.format("ddd, DD MMM YYYY HH:mm:ss ZZ");
          this.formData.timestamp = timeProcessResult.valueOf();
          this.formData.unixTimestamp = timeProcessResult.unix();
          this.formData.timestampHex = timeProcessResult.valueOf().toString(16);
        } else {
          Object.assign(this.formData, {
            localeDate: null,
            utcDate: null,
            jsDate: null,
            isoDate: null,
            rfcDate: null,
            timestamp: null,
            unixTimestamp: null,
            timestampHex: null
          });
        }
      } catch (error) {
        console.log(error);
      }
    }, 100);
  },
  methods: {
    copyTime(sourceTime) {
      c.copy(sourceTime);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");