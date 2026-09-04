/* dp disabled */;
import { execute } from "../../../lib/ImageMagick/magickApi.js";
Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    var param0 = (param1, param2, param3) => {
      if (this.processOptions.customImageWidth != null && this.processOptions.customImageWidth != "") {
        if (isNaN(this.processOptions.customImageWidth) || !/^[0-9]+$/.test(this.processOptions.customImageWidth)) {
          param3(new Error(this.$t("common.mustBeInt")));
        }
      }
      if (this.processOptions.customImageHeight != null && this.processOptions.customImageHeight != "") {
        if (isNaN(this.processOptions.customImageHeight) || !/^[0-9]+$/.test(this.processOptions.customImageHeight)) {
          param3(new Error(this.$t("common.mustBeInt")));
        }
      }
      param3();
    };
    return {
      imageExtArr: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tif", "tiff", "ico", "psd", "tga", "miff", "pcx", "fits", "ppm", "pgm", "pfm", "mng", "hdr", "dds", "otb", "psb"],
      fileList: [],
      addingFile: false,
      processing: false,
      loading: null,
      processOptions: {
        type: 1,
        width: null,
        height: null,
        percentage: 50,
        toScale: true,
        filterSmallSize: true
      },
      processOptionsRules: {
        customResolution: [{
          validator: param0,
          trigger: "blur"
        }]
      }
    };
  },
  computed: {
    fileAccept() {
      var dotPrefixedExts = [];
      for (var extIndex = 0; extIndex < this.imageExtArr.length; extIndex++) {
        dotPrefixedExts.push("." + this.imageExtArr[extIndex]);
      }
      return dotPrefixedExts.join(",");
    },
    imageList() {
      var filesWithSourceBlob = [];
      for (var fileIndex = 0; fileIndex < this.fileList.length; fileIndex++) {
        if (this.fileList[fileIndex].sourceConvertBlobUrl) {
          filesWithSourceBlob.push(this.fileList[fileIndex].sourceConvertBlobUrl);
        } else {
          filesWithSourceBlob.push(this.fileList[fileIndex].sourceBlobUrl);
        }
      }
      return filesWithSourceBlob;
    },
    processBtnDisabled() {
      if (this.fileList.length == 0 || this.addingFile) {
        return true;
      }
      if (this.processOptions.type == 0 && c.isNullOrEmpty(this.processOptions.width) && c.isNullOrEmpty(this.processOptions.height)) {
        return true;
      }
      return false;
    },
    processedCount() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var filteredFileList = this.fileList.filter(fileItem => {
        return fileItem.newBlob != null;
      });
      return filteredFileList.length;
    },
    processPercent() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var filesWithNewBlob = this.fileList.filter(fileItem => {
        return fileItem.newBlob != null;
      });
      return locales.percentage.replace("100%", filesWithNewBlob.length + "/" + this.fileList.length);
    },
    processOptionsPercentage() {
      return locales.settingTip3.replace("50%", this.processOptions.percentage + "%");
    }
  },
  watch: {
    "processOptions.type"(newType, oldType) {
      this.setImageNewSize();
    },
    "processOptions.width"(newWidth, oldWidth) {
      console.log(this.processOptions.width);
      console.log(this.processOptions.height);
      this.setImageNewSize();
    },
    "processOptions.height"(newHeight, oldHeight) {
      this.setImageNewSize();
    },
    "processOptions.percentage"(newPercentage, oldPercentage) {
      this.setImageNewSize();
    },
    "processOptions.toScale"(newToScale, oldToScale) {
      this.setImageNewSize();
    },
    "processOptions.filterSmallSize"(newFilterSmallSize, oldFilterSmallSize) {
      this.setImageNewSize();
    }
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
    this.dragEventBind();
  },
  methods: {
    dragEventBind() {
      var that = this;
      function handleFileData(fileData) {
        that.addFileListData(fileData);
      }
      var fileBoxElement = document.querySelector(".file-box");
      fileBoxElement.addEventListener("dragenter", function (dragEnterEvent) {
        dragEnterEvent.preventDefault();
        dragEnterEvent.stopPropagation();
      }, false);
      fileBoxElement.addEventListener("dragover", function (dragOverEvent) {
        dragOverEvent.dataTransfer.dropEffect = "copy";
        dragOverEvent.preventDefault();
        dragOverEvent.stopPropagation();
      }, false);
      fileBoxElement.addEventListener("dragleave", function (dragLeaveEvent) {
        dragLeaveEvent.preventDefault();
        dragLeaveEvent.stopPropagation();
      }, false);
      fileBoxElement.addEventListener("drop", function (dropEvent) {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();
        var dataTransferObj = dropEvent.dataTransfer;
        var fileArray = [];
        var counter = 0;
        var fileCount = dataTransferObj.files.length;
        function processFiles() {
          if (counter === fileCount - 1) {
            handleFileData(fileArray);
          }
          counter++;
        }
        if (dataTransferObj.items !== undefined) {
          for (var itemIndex = 0; itemIndex < dataTransferObj.items.length; itemIndex++) {
            var currentItem = dataTransferObj.items[itemIndex];
            if (currentItem.kind === "file" && currentItem.webkitGetAsEntry().isFile) {
              var currentFile = currentItem.getAsFile();
              fileArray.push(currentFile);
            }
          }
          handleFileData(fileArray);
        } else {
          for (var itemIndex = 0; itemIndex < fileCount; itemIndex++) {
            var selectedFile = dataTransferObj.files[itemIndex];
            if (selectedFile.type) {
              fileArray.push(selectedFile);
              processFiles();
            } else {
              try {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(selectedFile.slice(0, 3));
                fileReader.addEventListener("load", function (loadEvent) {
                  console.log(loadEvent, "load");
                  fileArray.push(selectedFile);
                  processFiles();
                }, false);
                fileReader.addEventListener("error", function (errorEvent) {
                  console.log(errorEvent, "error，cannot upload folder");
                  processFiles();
                }, false);
              } catch (catchError) {
                console.log(catchError, "catch error，cannot upload folder");
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
    handleFileSelect(selectEvent) {
      this.addFileListData(selectEvent.target.files);
    },
    addFileListData(fileListData) {
      if (this.addingFile) {
        return;
      }
      this.addingFile = true;
      var clonedImageExts = c.clone(this.imageExtArr);
      clonedImageExts.remove("jpg");
      clonedImageExts.remove("jpeg");
      clonedImageExts.remove("png");
      clonedImageExts.remove("webp");
      clonedImageExts.remove("gif");
      clonedImageExts.remove("bmp");
      setTimeout(() => {
        var loadImageByIndex = fileIndex => {
          var image = new Image();
          image.src = this.fileList[fileIndex].sourceConvertBlobUrl ?? this.fileList[fileIndex].sourceBlobUrl;
          image.onload = () => {
            this.fileList[fileIndex].sourceWidth = image.width;
            this.fileList[fileIndex].sourceHeight = image.height;
            this.setImageNewSize(fileIndex);
            closeLoading(fileIndex - offset);
          };
        };
        var processImage = (imageBlob, url, onSuccess) => {
          fetch(url).then(async response => {
            try {
              let arrayBuffer = await response.arrayBuffer();
              let bytes = new Uint8Array(arrayBuffer);
              var executeResult = await execute({
                inputFiles: [{
                  name: "input." + onSuccess,
                  content: bytes
                }],
                commands: "convert input." + onSuccess + " out.png"
              });
              if (executeResult.outputFiles.length > 0 && executeResult.outputFiles[0].blob != null && executeResult.outputFiles[0].blob.size > 0) {
                this.fileList[imageBlob].sourceConvertBlobUrl = URL.createObjectURL(executeResult.outputFiles[0].blob);
                loadImageByIndex(imageBlob);
              }
              if (this.loading) {
                this.loading.close();
                this.loading = null;
              }
            } catch (error) {}
          });
        };
        var offset = this.fileList.length;
        var fileCount = fileListData.length;
        function* fileIterator() {
          for (var index = 0; index < fileCount; index++) {
            yield processFile(index);
          }
        }
        var processFile = processIndex => {
          var fileExtension = fileListData[processIndex].name.substring(fileListData[processIndex].name.lastIndexOf(".") + 1).toLowerCase();
          if (!this.imageExtArr.includes(fileExtension)) {
            closeLoading(processIndex);
          } else {
            var filteredFiles = this.fileList.filter(file => {
              return file.name == fileListData[processIndex].name;
            });
            if (filteredFiles.length > 0) {
              closeLoading(processIndex);
            } else {
              try {
                var objectUrl = URL.createObjectURL(fileListData[processIndex]);
                this.fileList.push({
                  name: fileListData[processIndex].name,
                  sourceFormat: fileExtension,
                  originalSize: fileListData[processIndex].size,
                  originalSizeDesc: c.transSizeDesc(fileListData[processIndex].size, 1),
                  newSize: null,
                  newSizeDesc: null,
                  sourceBlobUrl: objectUrl,
                  sourceConvertBlobUrl: null,
                  newBlob: null,
                  sourceWidth: null,
                  sourceHeight: null,
                  newWidth: null,
                  newHeight: null
                });
                if (clonedImageExts.includes(fileExtension)) {
                  setTimeout(() => {
                    this.loading = this.$loading({
                      target: document.querySelectorAll(".file-item")[processIndex + offset]
                    });
                    processImage(processIndex + offset, objectUrl, fileExtension);
                  }, 30);
                } else {
                  loadImageByIndex(processIndex + offset);
                }
              } catch (error) {
                closeLoading(processIndex);
              }
            }
          }
        };
        var closeLoading = payload => {
          if (this.loading) {
            this.loading.close();
            this.loading = null;
          }
          if (payload == fileCount - 1) {
            this.addingFile = false;
            document.getElementById("flFile").value = null;
          } else {
            setTimeout(() => {
              iterator.next();
            }, 10);
          }
        };
        var iterator = fileIterator();
        iterator.next();
      }, 80);
    },
    removeFileListData(targetIndex) {
      if (this.processing) {
        return;
      }
      if (targetIndex != null) {
        this.fileList.splice(targetIndex, 1);
      } else {
        this.$confirm(locales.clearConfirm, locales.alertTitle, {
          confirmButtonText: locales.ok,
          cancelButtonText: locales.cancel
        }).then(() => {
          this.fileList = [];
        });
      }
    },
    setImageNewSize(currentIndex) {
      var widthValue = !c.isNullOrEmpty(this.processOptions.width) ? Number(this.processOptions.width) : null;
      var heightValue = !c.isNullOrEmpty(this.processOptions.height) ? Number(this.processOptions.height) : null;
      var startIndex = currentIndex || 0;
      var nextIndex = currentIndex != null ? currentIndex + 1 : this.fileList.length;
      for (var iteratorIndex = startIndex; iteratorIndex < nextIndex; iteratorIndex++) {
        if (this.fileList[iteratorIndex].newBlob != null) {
          continue;
        }
        var targetWidth = null;
        var targetHeight = null;
        var sourceWidth = this.fileList[iteratorIndex].sourceWidth;
        var sourceHeight = this.fileList[iteratorIndex].sourceHeight;
        if (this.processOptions.type == 0) {
          if (this.processOptions.toScale) {
            if (widthValue != null && heightValue != null) {
              if (sourceWidth < widthValue && sourceHeight < heightValue && this.processOptions.filterSmallSize) {
                targetWidth = sourceWidth;
                targetHeight = sourceHeight;
              } else if (sourceWidth / sourceHeight > widthValue / heightValue) {
                targetWidth = widthValue;
                targetHeight = sourceHeight * widthValue / sourceWidth;
              } else {
                targetWidth = sourceWidth * heightValue / sourceHeight;
                targetHeight = heightValue;
              }
            } else if (widthValue != null && heightValue == null) {
              if (sourceWidth < widthValue && this.processOptions.filterSmallSize) {
                targetWidth = sourceWidth;
                targetHeight = sourceHeight;
              } else {
                targetWidth = widthValue;
                targetHeight = sourceHeight * widthValue / sourceWidth;
              }
            } else if (widthValue == null && heightValue != null) {
              if (sourceHeight < heightValue && this.processOptions.filterSmallSize) {
                targetWidth = sourceWidth;
                targetHeight = sourceHeight;
              } else {
                targetWidth = sourceWidth * heightValue / sourceHeight;
                targetHeight = heightValue;
              }
            }
          } else if (widthValue != null && heightValue != null) {
            targetWidth = widthValue;
            targetHeight = heightValue;
            if (this.processOptions.filterSmallSize) {
              if (sourceWidth < widthValue) {
                targetWidth = sourceWidth;
              }
              if (sourceHeight < heightValue) {
                targetHeight = sourceHeight;
              }
            }
          } else if (widthValue != null && heightValue == null) {
            if (sourceWidth < widthValue && this.processOptions.filterSmallSize) {
              targetWidth = sourceWidth;
              targetHeight = sourceHeight;
            } else {
              targetWidth = widthValue;
              targetHeight = sourceHeight * widthValue / sourceWidth;
            }
          } else if (widthValue == null && heightValue != null) {
            if (sourceHeight < heightValue && this.processOptions.filterSmallSize) {
              targetWidth = sourceWidth;
              targetHeight = sourceHeight;
            } else {
              targetWidth = sourceWidth * heightValue / sourceHeight;
              targetHeight = heightValue;
            }
          }
        } else if (this.processOptions.type == 1) {
          targetWidth = sourceWidth * this.processOptions.percentage / 100;
          targetHeight = sourceHeight * this.processOptions.percentage / 100;
        }
        if (targetWidth != null && targetHeight != null) {
          targetWidth = parseInt(targetWidth, 10);
          targetHeight = parseInt(targetHeight, 10);
          this.fileList[iteratorIndex].newWidth = targetWidth <= 0 ? 1 : targetWidth;
          this.fileList[iteratorIndex].newHeight = targetHeight <= 0 ? 1 : targetHeight;
        } else {
          this.fileList[iteratorIndex].newWidth = null;
          this.fileList[iteratorIndex].newHeight = null;
        }
      }
    },
    process() {
      if (this.processing) {
        return;
      }
      var pendingFiles = this.fileList.filter(fileItem => {
        return fileItem.newBlob == null;
      });
      if (pendingFiles.length == 0) {
        return;
      }
      this.processing = true;
      setTimeout(() => {
        var totalFiles = this.fileList.length;
        function* generator() {
          for (var loopIndex = 0; loopIndex < totalFiles; loopIndex++) {
            yield resizeImage(loopIndex);
          }
        }
        var resizeImage = currentIndex => {
          if (this.fileList[currentIndex].newBlob != null) {
            skipProcessedFile(currentIndex);
          } else {
            this.loading = this.$loading({
              target: document.querySelectorAll(".file-item")[currentIndex]
            });
            try {
              if (this.fileList[currentIndex].sourceFormat == "webp") {
                setTimeout(() => {
                  var imageEl = new Image();
                  imageEl.src = this.fileList[currentIndex].sourceBlobUrl;
                  imageEl.onload = () => {
                    var canvasEl = document.createElement("canvas");
                    canvasEl.width = this.fileList[currentIndex].newWidth;
                    canvasEl.height = this.fileList[currentIndex].newHeight;
                    var ctx = canvasEl.getContext("2d");
                    ctx.drawImage(imageEl, 0, 0, canvasEl.width, canvasEl.height);
                    var dataUrl = canvasEl.toDataURL("image/webp", 1);
                    this.fileList[currentIndex].newBlob = c.base64ToBlob(dataUrl);
                    this.fileList[currentIndex].newSize = this.fileList[currentIndex].newBlob.size;
                    this.fileList[currentIndex].newSizeDesc = c.transSizeDesc(this.fileList[currentIndex].newSize, 1);
                    skipProcessedFile(currentIndex);
                  };
                }, 50);
              } else {
                fetch(this.fileList[currentIndex].sourceBlobUrl).then(async response => {
                  try {
                    let arrayBuffer = await response.arrayBuffer();
                    let uint8Array = new Uint8Array(arrayBuffer);
                    var inputFiles = [{
                      name: "input." + this.fileList[currentIndex].sourceFormat,
                      content: uint8Array
                    }];
                    var convertCommand = "convert input." + this.fileList[currentIndex].sourceFormat + " " + (this.fileList[currentIndex].sourceFormat == "gif" ? "-coalesce " : "") + "-resize " + this.fileList[currentIndex].newWidth + "x" + this.fileList[currentIndex].newHeight + (this.processOptions.toScale ? "" : "!") + " out." + this.fileList[currentIndex].sourceFormat;
                    if (this.fileList[currentIndex].sourceFormat == "ico") {
                      let imgElement = document.querySelectorAll(".img-box img")[currentIndex];
                      var newWidth = this.fileList[currentIndex].newWidth;
                      var newHeight = this.fileList[currentIndex].newHeight;
                      var maxWidth = 256;
                      var maxHeight = 256;
                      var targetWidth = 0;
                      var targetHeight = 0;
                      if (newWidth < maxWidth && newHeight < maxHeight) {
                        targetWidth = newWidth;
                        targetHeight = newHeight;
                      } else if (newWidth / newHeight > maxWidth / maxHeight) {
                        targetWidth = maxWidth;
                        targetHeight = newHeight * maxWidth / newWidth;
                      } else {
                        targetWidth = newWidth * maxHeight / newHeight;
                        targetHeight = maxHeight;
                      }
                      convertCommand = "convert input.ico -resize " + targetWidth + "x" + targetHeight + (this.processOptions.toScale ? "" : "!") + " out.ico";
                    }
                    var executeResult = await execute({
                      inputFiles: inputFiles,
                      commands: convertCommand
                    });
                    if (executeResult.outputFiles.length > 0 && executeResult.outputFiles[0].blob != null && executeResult.outputFiles[0].blob.size > 0) {
                      this.fileList[currentIndex].newSize = executeResult.outputFiles[0].blob.size;
                      this.fileList[currentIndex].newSizeDesc = c.transSizeDesc(this.fileList[currentIndex].newSize, 1);
                      this.fileList[currentIndex].newBlob = executeResult.outputFiles[0].blob;
                    }
                    skipProcessedFile(currentIndex);
                  } catch (error) {
                    skipProcessedFile(currentIndex);
                  }
                });
              }
            } catch (err) {
              skipProcessedFile(currentIndex);
            }
          }
        };
        var skipProcessedFile = index => {
          if (this.loading) {
            this.loading.close();
            this.loading = null;
          }
          if (index == this.fileList.length - 1) {
            this.processing = false;
            this.$message.success(locales.processOver);
          } else {
            setTimeout(() => {
              var0.next();
            }, 10);
          }
        };
        var var0 = generator();
        var0.next();
      }, 50);
    },
    download(fileIndex) {
      var anchorEl = document.createElement("a");
      var outputFileName = this.fileList[fileIndex].name.substring(0, this.fileList[fileIndex].name.lastIndexOf(".") + 1) + this.fileList[fileIndex].sourceFormat;
      anchorEl.download = outputFileName;
      anchorEl.href = URL.createObjectURL(this.fileList[fileIndex].newBlob);
      anchorEl.click();
    },
    downloadAll() {
      var zipInstance = new JSZip();
      var resizeFolder = zipInstance.folder("resize-images");
      for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].newBlob == null) {
          continue;
        }
        var outputFileName = this.fileList[i].name.substring(0, this.fileList[i].name.lastIndexOf(".") + 1) + this.fileList[i].sourceFormat;
        resizeFolder.file(outputFileName, this.fileList[i].newBlob, {
          binary: true
        });
      }
      zipInstance.generateAsync({
        type: "blob"
      }).then(function (zipBlob) {
        saveAs(zipBlob, "resize-images.zip");
      });
    }
  }
}).use(ElementPlus).mount(".main-body");