Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      blobUrl: null,
      base64: null,
      loading: null
    };
  },
  computed: {
    htmlCode() {
      return "<img src=\"" + this.base64 + "\" />";
    },
    cssCode() {
      return "background-image: url(\"" + this.base64 + "\");";
    }
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
  },
  methods: {
    selectImg() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(fileSelectEvent) {
      this.loading = this.$loading({
        target: document.querySelector(".img-box"),
        text: "loading"
      });
      setTimeout(() => {
        var selectedFiles = fileSelectEvent.target.files;
        var fileReader = new FileReader();
        fileReader.onload = fileLoadEvent => {
          this.base64 = fileLoadEvent.target.result;
          document.getElementById("flFile").value = "";
          if (this.loading) {
            this.loading.close();
            this.loading = null;
          }
        };
        fileReader.readAsDataURL(selectedFiles[0]);
        document.getElementById("flFile").value = null;
      }, 50);
    },
    downloadImg() {
      var downloadLink = document.createElement("a");
      var base64Blob = c.base64ToBlob(this.base64);
      downloadLink.download = "base64.png";
      downloadLink.href = URL.createObjectURL(base64Blob);
      downloadLink.click();
    },
    copy(textToCopy) {
      if (textToCopy == "base64") {
        c.copy(this.base64);
      } else if (textToCopy == "html") {
        c.copy(this.htmlCode);
      } else if (textToCopy == "css") {
        c.copy(this.cssCode);
      }
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");