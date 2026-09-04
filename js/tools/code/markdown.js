var vditor;
Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      loaded: false,
      exportPdfIng: false
    };
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
    this.initVditor();
  },
  methods: {
    selectFile() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(fileSelectEvent) {
      setTimeout(() => {
        var fileList = fileSelectEvent.target.files;
        var fileName = fileList[0].name;
        var fileExtension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
        if (fileExtension == ".markdown" || fileExtension == ".md") {
          var fileReader = new FileReader();
          fileReader.readAsText(fileList[0]);
          fileReader.onload = loadEvent => {
            vditor.setValue(loadEvent.target.result);
          };
        } else if (fileExtension == ".docx") {} else if (fileExtension == ".html") {}
        document.getElementById("flFile").value = null;
      }, 50);
    },
    initVditor() {
      var availableHeight = Number(window.innerHeight) - 300;
      if (availableHeight < 600) {
        availableHeight = 600;
      }
      vditor = new Vditor("markdown-editor", {
        height: availableHeight,
        toolbar: ["emoji", "headings", "bold", "italic", "strike", "link", "|", "list", "ordered-list", "check", "|", "quote", "line", "code", "inline-code", "|", "upload", "record", "table", "|", "undo", "redo", "|", "edit-mode", "both", "preview", "fullscreen", "|", "code-theme", "content-theme", "export", "devtools"],
        cdn: "https://unpkg.com/vditor@3.11.0",
        lang: "zh_CN",
        mode: "sv",
        preview: {
          theme: {
            path: "https://unpkg.com/vditor@3.11.0/dist/css/content-theme"
          },
          mode: "both",
          actions: []
        },
        hint: {
          emojiPath: "https://unpkg.com/vditor@3.11.0/dist/images/emoji"
        },
        cache: {
          enable: false
        },
        upload: {
          accept: "image/jpeg,image/png,image/gif,image/jpg,image/bmp,image/webp",
          async handler(files) {
            for (var index = 0; index < files.length; index++) {
              var currentFileName = files[index].name;
              var fileReader2 = new FileReader();
              fileReader2.onload = loadEvent2 => {
                vditor.insertValue("![" + currentFileName + "](" + loadEvent2.target.result + ")");
              };
              fileReader2.readAsDataURL(files[index]);
            }
          }
        },
        after: () => {
          this.loaded = true;
        }
      });
    },
    exportDw() {
      document.querySelector("[data-type=\"markdown\"]").click();
    },
    exportDoc() {
      var htmlTemplate = "<html><head><meta charset=\"utf-8\" /><style>\n        table { border-collapse: collapse; width: 100%; }\n        table td, table th { border: 1px solid #ccc; padding: 2px; text-align: center;word-break: break-all; }\n        table th { background-color: #f5f5f5; font-weight: 600; text-align: center; }\n    </style></head><body>" + vditor.getHTML() + "</body></html>";
      var docxBlob = htmlDocx.asBlob(htmlTemplate);
      saveAs(docxBlob, "markdown.docx");
    },
    exportHtml() {
      document.querySelector("[data-type=\"html\"]").click();
    },
    exportPdf2() {
      document.querySelector("[data-type=\"pdf\"]").click();
    },
    async copyText() {
      const editorHtml = vditor.getHTML();
      const plainText = editorHtml.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      const htmlBlob = new Blob([editorHtml], {
        type: "text/html"
      });
      const plainTextBlob = new Blob([plainText], {
        type: "text/plain"
      });
      try {
        await navigator.clipboard.write([new ClipboardItem({
          "text/html": htmlBlob,
          "text/plain": plainTextBlob
        })]);
        this.$message.success("复制成功，直接粘贴到Word即可保留格式。");
      } catch (error) {
        console.error("复制失败", error);
        this.$message.error("复制失败，请更换浏览器试下，推荐使用Edge、Chrome浏览器");
      }
    }
  }
}).use(ElementPlus).mount(".main-body");