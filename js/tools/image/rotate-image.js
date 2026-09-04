/* dp disabled */;
import { execute } from "../../../lib/ImageMagick/magickApi.js";
Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      imageExtArr: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tif", "tiff", "ico", "psd", "tga", "miff", "pcx", "fits", "ppm", "pgm", "pfm", "mng", "hdr", "dds", "otb", "psb"],
      fileList: [],
      addingFile: false,
      processing: false,
      loading: null,
      processOptions: {
        fileType: 1
      }
    };
  },
  computed: {
    fileAccept() {
      var dotPrefixedExtList = [];
      for (var imageExtIndex = 0; imageExtIndex < this.imageExtArr.length; imageExtIndex++) {
        dotPrefixedExtList.push("." + this.imageExtArr[imageExtIndex]);
      }
      return dotPrefixedExtList.join(",");
    },
    imageList() {
      var filesWithConvertBlobUrl = [];
      for (var fileListIndex = 0; fileListIndex < this.fileList.length; fileListIndex++) {
        if (this.fileList[fileListIndex].sourceConvertBlobUrl) {
          filesWithConvertBlobUrl.push(this.fileList[fileListIndex].sourceConvertBlobUrl);
        } else {
          filesWithConvertBlobUrl.push(this.fileList[fileListIndex].sourceBlobUrl);
        }
      }
      return filesWithConvertBlobUrl;
    },
    processBtnDisabled() {
      if (this.fileList.length == 0 || this.addingFile) {
        return true;
      }
      var filteredFileList1 = this.fileList.filter(file1 => {
        return file1.rotate != 0;
      });
      if (filteredFileList1.length == 0) {
        return true;
      }
      return false;
    },
    processedCount() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var filteredFileList2 = this.fileList.filter(file2 => {
        return file2.newBlob != null;
      });
      return filteredFileList2.length;
    },
    processPercent() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var filteredFileList3 = this.fileList.filter(file3 => {
        return file3.newBlob != null;
      });
      return locales.percentage.replace("100%", filteredFileList3.length + "/" + this.fileList.length);
    }
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
    this.dragEventBind();
  },
  methods: {
    dragEventBind() {
      var that = this;
      function addFileListDataHandler(fileListData) {
        that.addFileListData(fileListData);
      }
      var fileBoxElement = document.querySelector(".file-box");
      fileBoxElement.addEventListener("dragenter", function (dragenterEvent) {
        dragenterEvent.preventDefault();
        dragenterEvent.stopPropagation();
      }, false);
      fileBoxElement.addEventListener("dragover", function (dragoverEvent) {
        dragoverEvent.dataTransfer.dropEffect = "copy";
        dragoverEvent.preventDefault();
        dragoverEvent.stopPropagation();
      }, false);
      fileBoxElement.addEventListener("dragleave", function (dragleaveEvent) {
        dragleaveEvent.preventDefault();
        dragleaveEvent.stopPropagation();
      }, false);
      fileBoxElement.addEventListener("drop", function (dropEvent) {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();
        var dataTransfer = dropEvent.dataTransfer;
        var fileList = [];
        var processedFileCount = 0;
        var fileCount = dataTransfer.files.length;
        function processFiles() {
          if (processedFileCount === fileCount - 1) {
            addFileListDataHandler(fileList);
          }
          processedFileCount++;
        }
        if (dataTransfer.items !== undefined) {
          for (var itemIndex = 0; itemIndex < dataTransfer.items.length; itemIndex++) {
            var item = dataTransfer.items[itemIndex];
            if (item.kind === "file" && item.webkitGetAsEntry().isFile) {
              var file = item.getAsFile();
              fileList.push(file);
            }
          }
          addFileListDataHandler(fileList);
        } else {
          for (var itemIndex = 0; itemIndex < fileCount; itemIndex++) {
            var fileFromList = dataTransfer.files[itemIndex];
            if (fileFromList.type) {
              fileList.push(fileFromList);
              processFiles();
            } else {
              try {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileFromList.slice(0, 3));
                fileReader.addEventListener("load", function (loadEvent) {
                  console.log(loadEvent, "load");
                  fileList.push(fileFromList);
                  processFiles();
                }, false);
                fileReader.addEventListener("error", function (errorEvent) {
                  console.log(errorEvent, "error，cannot upload folder");
                  processFiles();
                }, false);
              } catch (error) {
                console.log(error, "catch error，cannot upload folder");
                processFiles();
              }
            }
          }
        }
      }, false);
    },
    selectImg() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(fileSelectEvent) {
      this.addFileListData(fileSelectEvent.target.files);
    },
    addFileListData(fileListData) {
      if (this.addingFile) {
        return;
      }
      this.addingFile = true;
      var imageExtensions = c.clone(this.imageExtArr);
      imageExtensions.remove("jpg");
      imageExtensions.remove("jpeg");
      imageExtensions.remove("png");
      imageExtensions.remove("webp");
      imageExtensions.remove("gif");
      imageExtensions.remove("bmp");
      setTimeout(() => {
        var rotationStepHandler = angle => {
          var imageElement = new Image();
          imageElement.src = this.fileList[angle].sourceConvertBlobUrl ?? this.fileList[angle].sourceBlobUrl;
          imageElement.onload = () => {
            this.fileList[angle].sourceWidth = imageElement.width;
            this.fileList[angle].sourceHeight = imageElement.height;
            rotateImage(angle - baseAngle);
          };
        };
        var fetchAndProcessUrl = (fetchOptions, url, successCallback) => {
          fetch(url).then(async response => {
            try {
              let buffer = await response.arrayBuffer();
              let bytes = new Uint8Array(buffer);
              var result = await execute({
                inputFiles: [{
                  name: "input." + successCallback,
                  content: bytes
                }],
                commands: "convert input." + successCallback + " out.png"
              });
              if (result.outputFiles.length > 0 && result.outputFiles[0].blob != null && result.outputFiles[0].blob.size > 0) {
                this.fileList[fetchOptions].sourceConvertBlobUrl = URL.createObjectURL(result.outputFiles[0].blob);
                rotationStepHandler(fetchOptions);
              }
              if (this.loading) {
                this.loading.close();
                this.loading = null;
              }
            } catch (fetchError) {}
          });
        };
        var baseAngle = this.fileList.length;
        var length = fileListData.length;
        function* generator() {
          for (var index = 0; index < length; index++) {
            yield processItem(index);
          }
        }
        var processItem = fileIndex => {
          var fileExtension = fileListData[fileIndex].name.substring(fileListData[fileIndex].name.lastIndexOf(".") + 1).toLowerCase();
          if (!this.imageExtArr.includes(fileExtension)) {
            rotateImage(fileIndex);
          } else {
            var filteredFiles = this.fileList.filter(fileItem => {
              return fileItem.name == fileListData[fileIndex].name;
            });
            if (filteredFiles.length > 0) {
              rotateImage(fileIndex);
            } else {
              try {
                var objectUrl = URL.createObjectURL(fileListData[fileIndex]);
                this.fileList.push({
                  name: fileListData[fileIndex].name,
                  sourceFormat: fileExtension,
                  originalSize: fileListData[fileIndex].size,
                  originalSizeDesc: c.transSizeDesc(fileListData[fileIndex].size, 1),
                  newSize: null,
                  sourceBlob: fileListData[fileIndex],
                  sourceBlobUrl: objectUrl,
                  sourceConvertBlobUrl: null,
                  newBlob: null,
                  sourceWidth: null,
                  sourceHeight: null,
                  rotate: 0
                });
                if (imageExtensions.includes(fileExtension)) {
                  setTimeout(() => {
                    this.loading = this.$loading({
                      target: document.querySelectorAll(".file-item")[fileIndex + baseAngle]
                    });
                    fetchAndProcessUrl(fileIndex + baseAngle, objectUrl, fileExtension);
                  }, 30);
                } else {
                  rotationStepHandler(fileIndex + baseAngle);
                }
              } catch (rotateError) {
                rotateImage(fileIndex);
              }
            }
          }
        };
        var rotateImage = rotateIndex => {
          if (this.loading) {
            this.loading.close();
            this.loading = null;
          }
          if (rotateIndex == length - 1) {
            this.addingFile = false;
            document.getElementById("flFile").value = null;
          } else {
            setTimeout(() => {
              iterator.next();
            }, 10);
          }
        };
        var iterator = generator();
        iterator.next();
      }, 80);
    },
    removeFileListData(fileItem) {
      if (this.processing) {
        return;
      }
      if (fileItem != null) {
        this.fileList.splice(fileItem, 1);
      } else {
        this.$confirm(locales.clearConfirm, locales.alertTitle, {
          confirmButtonText: locales.ok,
          cancelButtonText: locales.cancel
        }).then(() => {
          this.fileList = [];
        });
      }
    },
    rotateImage(imageEl) {
      if (imageEl == "reset") {
        for (var fileIndex = 0; fileIndex < this.fileList.length; fileIndex++) {
          this.fileList[fileIndex].rotate = 0;
        }
        return;
      }
      var rotationDelta = 0;
      if (imageEl == "right") {
        rotationDelta = 90;
      } else if (imageEl == "left") {
        rotationDelta = -90;
      }
      for (var fileIndex = 0; fileIndex < this.fileList.length; fileIndex++) {
        if (this.processOptions.fileType == 1 || this.processOptions.fileType == 2 && this.fileList[fileIndex].sourceWidth <= this.fileList[fileIndex].sourceHeight || this.processOptions.fileType == 3 && this.fileList[fileIndex].sourceWidth >= this.fileList[fileIndex].sourceHeight) {
          var newRotateValue = this.fileList[fileIndex].rotate + rotationDelta;
          if (newRotateValue == 360 || newRotateValue == -360) {
            newRotateValue = 0;
          }
          this.fileList[fileIndex].rotate = newRotateValue;
        }
      }
    },
    process() {
      if (this.processing) {
        return;
      }
      for (var fileListLoopIndex = 0; fileListLoopIndex < this.fileList.length; fileListLoopIndex++) {
        this.fileList[fileListLoopIndex].newBlob = null;
      }
      this.processing = true;
      setTimeout(() => {
        var fileListLength = this.fileList.length;
        function* fileListIterator() {
          for (var removeIndex = 0; removeIndex < fileListLength; removeIndex++) {
            yield removeFileByIndex(removeIndex);
          }
        }
        var removeFileByIndex = removeFileIndex => {
          this.loading = this.$loading({
            target: document.querySelectorAll(".file-item")[removeFileIndex]
          });
          try {
            if (this.fileList[removeFileIndex].rotate == 0) {
              this.fileList[removeFileIndex].newBlob = this.fileList[removeFileIndex].sourceBlob;
              processFile(removeFileIndex);
              return;
            }
            if (this.fileList[removeFileIndex].sourceFormat == "webp") {
              setTimeout(() => {
                var imageElement = new Image();
                imageElement.src = this.fileList[removeFileIndex].sourceBlobUrl;
                imageElement.onload = () => {
                  var canvasElement = document.createElement("canvas");
                  if (this.fileList[removeFileIndex].rotate % 180 == 0) {
                    canvasElement.width = this.fileList[removeFileIndex].sourceWidth;
                    canvasElement.height = this.fileList[removeFileIndex].sourceHeight;
                  } else {
                    canvasElement.width = this.fileList[removeFileIndex].sourceHeight;
                    canvasElement.height = this.fileList[removeFileIndex].sourceWidth;
                  }
                  var canvasContext = canvasElement.getContext("2d");
                  canvasContext.save();
                  canvasContext.translate(canvasElement.width / 2, canvasElement.height / 2);
                  canvasContext.rotate(this.fileList[removeFileIndex].rotate * (Math.PI / 180));
                  canvasContext.drawImage(imageElement, -imageElement.width / 2, -imageElement.height / 2);
                  canvasContext.restore();
                  var webpDataUrl = canvasElement.toDataURL("image/webp", 1);
                  this.fileList[removeFileIndex].newBlob = c.base64ToBlob(webpDataUrl);
                  processFile(removeFileIndex);
                };
              }, 50);
            } else {
              fetch(this.fileList[removeFileIndex].sourceBlobUrl).then(async fetchResponse => {
                try {
                  let bufferData = await fetchResponse.arrayBuffer();
                  let byteArray = new Uint8Array(bufferData);
                  var fileDataParts = [{
                    name: "input." + this.fileList[removeFileIndex].sourceFormat,
                    content: byteArray
                  }];
                  var convertCmd = "convert input." + this.fileList[removeFileIndex].sourceFormat + " " + (this.fileList[removeFileIndex].sourceFormat == "gif" ? "-coalesce " : "") + "-rotate " + this.fileList[removeFileIndex].rotate + " out." + this.fileList[removeFileIndex].sourceFormat;
                  if (this.fileList[removeFileIndex].sourceFormat == "ico") {
                    let imgElement = document.querySelectorAll(".img-box img")[removeFileIndex];
                    var sourceWidth = this.fileList[removeFileIndex].sourceWidth;
                    var sourceHeight = this.fileList[removeFileIndex].sourceHeight;
                    var thumbnailWidth = 256;
                    var thumbnailHeight = 256;
                    var targetWidth = 0;
                    var targetHeight = 0;
                    if (sourceWidth < thumbnailWidth && sourceHeight < thumbnailHeight) {
                      targetWidth = sourceWidth;
                      targetHeight = sourceHeight;
                    } else if (sourceWidth / sourceHeight > thumbnailWidth / thumbnailHeight) {
                      targetWidth = thumbnailWidth;
                      targetHeight = sourceHeight * thumbnailWidth / sourceWidth;
                    } else {
                      targetWidth = sourceWidth * thumbnailHeight / sourceHeight;
                      targetHeight = thumbnailHeight;
                    }
                    convertCmd = "convert input.ico -resize " + targetWidth + "x" + targetHeight + " -rotate " + this.fileList[removeFileIndex].rotate + " out.ico";
                  }
                  var executeResult = await execute({
                    inputFiles: fileDataParts,
                    commands: convertCmd
                  });
                  if (executeResult.outputFiles.length > 0 && executeResult.outputFiles[0].blob != null && executeResult.outputFiles[0].blob.size > 0) {
                    this.fileList[removeFileIndex].newBlob = executeResult.outputFiles[0].blob;
                  }
                  processFile(removeFileIndex);
                } catch (error) {
                  processFile(removeFileIndex);
                }
              });
            }
          } catch (err) {
            processFile(removeFileIndex);
          }
        };
        var processFile = file => {
          if (this.loading) {
            this.loading.close();
            this.loading = null;
          }
          if (file == this.fileList.length - 1) {
            this.processing = false;
            this.$message.success(locales.processOver);
          } else {
            setTimeout(() => {
              iterator.next();
            }, 10);
          }
        };
        var iterator = fileListIterator();
        iterator.next();
      }, 50);
    },
    download(downloadIndex) {
      var linkElement = document.createElement("a");
      var downloadFileName = this.fileList[downloadIndex].name.substring(0, this.fileList[downloadIndex].name.lastIndexOf(".") + 1) + this.fileList[downloadIndex].sourceFormat;
      linkElement.download = downloadFileName;
      linkElement.href = URL.createObjectURL(this.fileList[downloadIndex].newBlob);
      linkElement.click();
    },
    downloadAll() {
      var zipInstance = new JSZip();
      var zipFolder = zipInstance.folder("rotate-image");
      for (var index = 0; index < this.fileList.length; index++) {
        if (this.fileList[index].newBlob == null) {
          continue;
        }
        var outputFileName = this.fileList[index].name.substring(0, this.fileList[index].name.lastIndexOf(".") + 1) + this.fileList[index].sourceFormat;
        zipFolder.file(outputFileName, this.fileList[index].newBlob, {
          binary: true
        });
      }
      zipInstance.generateAsync({
        type: "blob"
      }).then(function (resolvedValue) {
        saveAs(resolvedValue, "rotate-image.zip");
      });
    }
  }
}).use(ElementPlus).mount(".main-body");