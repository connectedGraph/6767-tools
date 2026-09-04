var vueObj = Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        character: Math.round(Math.random() * 999999).toString(),
        hashType: "SHA-512",
        outputType: "HEX",
        size: 300,
        rounds: 1,
        salt: 0
      },
      showAdvancedSetting: false,
      hashImg: null
    };
  },
  mounted() {
    this.compute();
  },
  methods: {
    compute() {
      var shaObj = new jsSHA(this.formData.character + this.formData.salt, "TEXT");
      var hashResult = shaObj.getHash(this.formData.hashType, this.formData.outputType, this.formData.rounds);
      var identiconString = new Identicon(hashResult, Number(this.formData.size)).toString();
      this.hashImg = "data:image/png;base64," + identiconString;
    },
    downloadFile() {
      var downloadAnchor = document.createElement("a");
      downloadAnchor.download = new Date().getTime() + ".png";
      downloadAnchor.href = URL.createObjectURL(c.base64ToBlob(this.hashImg));
      downloadAnchor.click();
    }
  }
}).use(ElementPlus).mount(".main-body");