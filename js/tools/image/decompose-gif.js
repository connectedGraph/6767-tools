Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      imageExtArr: ["gif"],
      imgList: [],
      processing: false
    };
  },
  computed: {
    fileAccept() {
      var dottedExtArr = [];
      for (var extIndex = 0; extIndex < this.imageExtArr.length; extIndex++) {
        dottedExtArr.push("." + this.imageExtArr[extIndex]);
      }
      return dottedExtArr.join(",");
    },
    imgUrlList() {
      var imgUrlList = [];
      for (var imgListIndex = 0; imgListIndex < this.imgList.length; imgListIndex++) {
        imgUrlList.push(this.imgList[imgListIndex].url);
      }
      return imgUrlList;
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
      var selectedFile = fileSelectEvent.target.files[0];
      var fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".") + 1).toLowerCase();
      if (!this.imageExtArr.includes(fileExtension)) {
        return;
      }
      this.processing = true;
      this.imgList = [];
      var gifParser = new gifParserPlugin();
      var gifInfoPromise = gifParser.getInfo(selectedFile);
      gifInfoPromise.then(gifInfo => {
        if (gifInfo.images.length == 0) {
          this.imgList = [{
            blob: selectedFile,
            url: URL.createObjectURL(selectedFile)
          }];
          this.processing = false;
        } else {
          var imgElement = document.createElement("img");
          imgElement.setAttribute("rel:animated_src", URL.createObjectURL(selectedFile));
          imgElement.setAttribute("rel:auto_play", "0");
          var superGifInstance = new SuperGif({
            gif: imgElement
          });
          superGifInstance.load(() => {
            var frameBlobs = [];
            for (let frameIndex = 1; frameIndex <= superGifInstance.get_length(); frameIndex++) {
              superGifInstance.move_to(frameIndex);
              var frameBlob = c.base64ToBlob(superGifInstance.get_canvas().toDataURL("image/png"));
              frameBlobs.push({
                blob: frameBlob,
                url: URL.createObjectURL(frameBlob)
              });
            }
            this.imgList = frameBlobs;
            this.processing = false;
          });
        }
      });
      document.getElementById("flFile").value = null;
    },
    download(fileNamePrefix) {
      var anchorElement = document.createElement("a");
      var gifFileName = fileNamePrefix + ".gif";
      anchorElement.download = gifFileName;
      anchorElement.href = this.imgList[fileNamePrefix].url;
      anchorElement.click();
    },
    downloadAll() {
      var zipInstance = new JSZip();
      var zipFolder = zipInstance.folder("gif-decomposition");
      for (var imageIndex = 0; imageIndex < this.imgList.length; imageIndex++) {
        var pngFileName = imageIndex + ".png";
        zipFolder.file(pngFileName, this.imgList[imageIndex].blob, {
          binary: true
        });
      }
      zipInstance.generateAsync({
        type: "blob"
      }).then(function (zipBlob) {
        saveAs(zipBlob, "gif-decomposition.zip");
      });
    }
  }
}).use(ElementPlus).mount(".main-body");