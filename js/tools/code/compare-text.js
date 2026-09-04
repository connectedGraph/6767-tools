var editor = null;
Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      language: "plaintext",
      languageArr: ["plaintext"],
      fileType: null,
      modifiedExt: null
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
      var availableLanguages = monaco.languages.getLanguages();
      var filteredLanguages = [];
      for (var languageIndex = 0; languageIndex < availableLanguages.length; languageIndex++) {
        if (availableLanguages[languageIndex].id != "plaintext" && availableLanguages[languageIndex].id.indexOf("freemarker2.tag") != 0) {
          filteredLanguages.push(availableLanguages[languageIndex].id);
        }
      }
      filteredLanguages = filteredLanguages.sort();
      filteredLanguages.splice(0, 0, "plaintext");
      this.languageArr = filteredLanguages;
      editor = monaco.editor.createDiffEditor(document.getElementById("editor-container"), {
        theme: 'vs-dark',
        automaticLayout: true,
        originalEditable: true,
        readOnly: false,
        minimap: {
          enabled: false
        }
      });
      editor.setModel({
        original: monaco.editor.createModel("function x() {\n\tconsole.log(\"Hello world!\");\n}", this.language),
        modified: monaco.editor.createModel("function x() {\n\tconsole.log(\"Hello world2!\");\n}", this.language)
      });
    });
  },
  methods: {
    selectFile(fileToCompare) {
      this.fileType = fileToCompare;
      document.getElementById("flFile").click();
    },
    handleFileSelect(fileSelectEvent) {
      var selectedFile = fileSelectEvent.target.files[0];
      if (this.fileType == "modified") {
        this.modifiedExt = selectedFile.name.substring(selectedFile.name.lastIndexOf(".") + 1).toLowerCase();
      }
      var fileReader = new FileReader();
      fileReader.readAsText(selectedFile);
      fileReader.onload = loadEvent => {
        if (this.fileType == "original") {
          editor.getModel().original.setValue(loadEvent.target.result);
        } else {
          editor.getModel().modified.setValue(loadEvent.target.result);
        }
      };
      document.getElementById("flFile").value = null;
    },
    changeLanguage(selectedLanguage) {
      monaco.editor.setModelLanguage(editor.getModel().original, selectedLanguage);
      monaco.editor.setModelLanguage(editor.getModel().modified, selectedLanguage);
    },
    downloadCode() {
      c.downloadTxt("format-result." + (c.isNullOrEmpty(this.modifiedExt) ? "txt" : this.modifiedExt), editor.getModel().modified.getValue());
    },
    copyCode() {
      c.copy(editor.getModel().modified.getValue());
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");