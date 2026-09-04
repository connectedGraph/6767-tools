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
        value: "// Paste your JavaScript code here\nfunction hi() {\n    console.log(\"Hello World!\");\n}\nhi();",
        language: "javascript",
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
      if (fileExtension == "js") {
        var fileReader = new FileReader();
        fileReader.readAsText(selectedFile);
        fileReader.onload = loadEvent => {
          editor.setValue(loadEvent.target.result);
        };
      }
      document.getElementById("flFile").value = null;
    },
    beautifyCode(sourceCode) {
      var editorContent = editor.getValue();
      if (sourceCode == "compress") {
        if (this.deleteComment) {
          editorContent = editorContent.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "");
        }
        editorContent = editorContent.replace(/\s+/g, " ").replace(/;\s*/g, ";").replace(/,\s*/g, ",").replace(/\s*=\s*/g, "=").replace(/\s*:\s*/g, ":").replace(/\s*&&\s*/g, "&&").replace(/\s*==\s*/g, "==").replace(/\s*!=\s*/g, "!=").replace(/\s*\|\|\s*/g, "||").replace(/\s*\?\s*/g, "?").replace(/\s*{\s*/g, "{").replace(/\s*}\s*/g, "}").replace(/\s*\(\s*/g, "(").replace(/\s*\)\s*/g, ")").replace(/\s*\[\s*/g, "[").replace(/\s*\]\s*/g, "]").replace(/\s*;\s*/g, ";");
        editor.setValue(editorContent);
      } else {
        require([staticSiteHost + "/lib/js-beautify/beautify.js"], beautifyModule => {
          editorContent = beautifyModule.js_beautify(editorContent, {
            indent_size: 4,
            space_in_empty_paren: true
          });
          editorContent = editorContent.replace(/! function/g, "!function");
          editor.setValue(editorContent);
        });
      }
    },
    downloadCode() {
      c.downloadTxt("format-result.js", editor.getValue());
    },
    copyCode() {
      c.copy(editor.getValue());
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");