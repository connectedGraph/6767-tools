var editor = null;
Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      deleteComment: true
    };
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
    require.config({
      paths: {
        vs: staticSiteHost + "/lib/monaco-editor/min/vs"
      }
    });
    require(["vs/editor/editor.main"], () => {
      editor = monaco.editor.create(document.getElementById("editor-container"), {
        value: "html {\n    position: relative; min-height: 100%;\n}\nbody { \n    margin: 0; \n    padding: 0; \n    font-family: Microsoft YaHei,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,SimSun,sans-serif; \n    font-size: 14px; \n    color: #222; \n    line-height: 1.42857143;\n    background-color: #f5f5f5;\n}",
        language: "css",
        theme: 'vs-dark',
        minimap: {
          enabled: true
        },
        automaticLayout: true,
        wordWrap: "on"
      });
    });
  },
  methods: {
    selectFile() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(event) {
      var file = event.target.files[0];
      var fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
      if (fileExtension == "css") {
        var fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = loadEvent => {
          editor.setValue(loadEvent.target.result);
        };
      }
      document.getElementById("flFile").value = null;
    },
    beautifyCode(code) {
      var formatSettings = null;
      if (code == "format") {
        formatSettings = {
          indent_size: 4,
          space_in_empty_paren: true
        };
      } else {
        formatSettings = {
          indent_size: 0,
          space_in_empty_paren: true,
          eol: ""
        };
      }
      require([staticSiteHost + "/lib/js-beautify/beautify-css.js"], cssBeautify => {
        var cssText = editor.getValue();
        if (code == "compress" && this.deleteComment) {
          cssText = cssText.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "");
        }
        var cssText = cssBeautify.css_beautify(cssText, formatSettings);
        editor.setValue(cssText);
      });
    },
    downloadCode() {
      c.downloadTxt("format-result.css", editor.getValue());
    },
    copyCode() {
      c.copy(editor.getValue());
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");