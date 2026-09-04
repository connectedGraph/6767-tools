var editor = null;
Vue.createApp({
  components: {
    comment: comment
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
        value: "<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello</title>\n</head>\n<body>\n    Hello world!\n</body>\n</html>",
        language: "html",
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
    handleFileSelect(fileSelectEvent) {
      var selectedFile = fileSelectEvent.target.files[0];
      var fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".") + 1).toLowerCase();
      if (fileExtension == "html") {
        var fileReader = new FileReader();
        fileReader.readAsText(selectedFile);
        fileReader.onload = fileLoadEvent => {
          editor.setValue(fileLoadEvent.target.result);
        };
      }
      document.getElementById("flFile").value = null;
    },
    beautifyCode(rawCode) {
      var beautifyOptions = null;
      if (rawCode == "format") {
        beautifyOptions = {
          indent_size: 4,
          space_in_empty_paren: true
        };
      } else {
        beautifyOptions = {
          indent_size: 0,
          space_in_empty_paren: true,
          eol: ""
        };
      }
      require([staticSiteHost + "/lib/js-beautify/beautify-html.js"], beautifyModule => {
        var beautifiedHtml = beautifyModule.html_beautify(editor.getValue(), beautifyOptions);
        editor.setValue(beautifiedHtml);
      });
    },
    downloadCode() {
      c.downloadTxt("format-result.html", editor.getValue());
    },
    copyCode() {
      c.copy(editor.getValue());
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");