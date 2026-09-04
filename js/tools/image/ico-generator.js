/* dp disabled */;
import { execute } from "../../../lib/ImageMagick/magickApi.js";
Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      formData: {
        image: null,
        size: "64*64",
        toScale: false
      },
      sizeArr: ["16*16", "32*32", "48*48", "64*64", "96*96", "128*128", "256*256"],
      imageExtArr: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tif", "tiff", "psd", "tga", "miff", "pcx", "fits", "ppm", "pgm", "pfm", "mng", "hdr", "dds", "otb", "psb"],
      converting: false,
      loading: null
    };
  },
  computed: {
    fileAccept() {
      var imageExtensionsWithDot = [];
      for (var index = 0; index < this.imageExtArr.length; index++) {
        imageExtensionsWithDot.push("." + this.imageExtArr[index]);
      }
      return imageExtensionsWithDot.join(",");
    },
    icoSize() {
      return Number(this.formData.size.split("*")[0]);
    }
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
  },
  methods: {
    selectImg() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(evt) {
      var file = evt.target.files[0];
      var fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
      if (!this.imageExtArr.includes(fileExtension)) {
        return;
      }
      if (this.formData.image != null && this.formData.image.name == file.name) {
        return;
      }
      var fileUrl = URL.createObjectURL(file);
      var clonedExts = c.clone(this.imageExtArr);
      clonedExts.remove("jpg");
      clonedExts.remove("jpeg");
      clonedExts.remove("png");
      clonedExts.remove("gif");
      clonedExts.remove("bmp");
      if (clonedExts.includes(fileExtension)) {
        this.loading = this.$loading({
          target: document.querySelector(".img-box")
        });
        if (fileExtension == "webp") {
          var image = new Image();
          image.src = fileUrl;
          image.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
            var pngDataUrl = canvas.toDataURL("image/png", 1);
            this.formData.image = {
              name: file.name,
              sourceFormat: "png",
              sourceBlobUrl: URL.createObjectURL(c.base64ToBlob(pngDataUrl)),
              newBlob: null
            };
            if (this.loading) {
              this.loading.close();
              this.loading = null;
            }
          };
        } else {
          fetch(fileUrl).then(async fetchResponse => {
            try {
              let imageArrayBuffer = await fetchResponse.arrayBuffer();
              let imageBytes = new Uint8Array(imageArrayBuffer);
              var executeResult = await execute({
                inputFiles: [{
                  name: "input." + fileExtension,
                  content: imageBytes
                }],
                commands: "convert input." + fileExtension + " out.png"
              });
              if (executeResult.outputFiles.length > 0 && executeResult.outputFiles[0].blob != null && executeResult.outputFiles[0].blob.size > 0) {
                this.formData.image = {
                  name: file.name,
                  sourceFormat: fileExtension,
                  sourceBlobUrl: URL.createObjectURL(executeResult.outputFiles[0].blob),
                  newBlob: null
                };
              }
              if (this.loading) {
                this.loading.close();
                this.loading = null;
              }
            } catch (error) {}
          });
        }
      } else {
        this.formData.image = {
          name: file.name,
          sourceFormat: fileExtension,
          sourceBlobUrl: fileUrl,
          newBlob: null
        };
      }
      document.getElementById("flFile").value = null;
    },
    convert() {
      if (this.converting) {
        return;
      }
      this.converting = true;
      setTimeout(() => {
        fetch(this.formData.image.sourceBlobUrl).then(async blobResponse => {
          try {
            let blobArrayBuffer = await blobResponse.arrayBuffer();
            let blobBytes = new Uint8Array(blobArrayBuffer);
            var executeResponse = await execute({
              inputFiles: [{
                name: "input." + this.formData.image.sourceFormat,
                content: blobBytes
              }],
              commands: "convert input." + this.formData.image.sourceFormat + (this.formData.image.sourceFormat == "gif" ? "[0]" : "") + " -resize " + this.formData.size.replace("*", "x") + (this.formData.toScale ? "" : "!") + " out.ico"
            });
            if (executeResponse.outputFiles.length > 0 && executeResponse.outputFiles[0].blob != null && executeResponse.outputFiles[0].blob.size > 0) {
              this.formData.image.newSize = executeResponse.outputFiles[0].blob.size;
              this.formData.image.newSizeDesc = c.transSizeDesc(this.formData.image.newSize, 1);
              this.formData.image.newBlob = executeResponse.outputFiles[0].blob;
            }
            this.converting = false;
            var anchorElement = document.createElement("a");
            var faviconFileName = "favicon.ico";
            anchorElement.download = faviconFileName;
            anchorElement.href = URL.createObjectURL(this.formData.image.newBlob);
            anchorElement.click();
          } catch (caughtError) {}
        });
      }, 50);
    }
  }
}).use(ElementPlus).mount(".main-body");