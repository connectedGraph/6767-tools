/* dp disabled */;
import { execute } from "../../../lib/ImageMagick/magickApi.js";
Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      imageExtArr: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tif", "tiff", "ico", "psd", "tga", "miff", "pcx", "fits", "ppm", "pgm", "pfm", "mng", "hdr", "dds", "otb", "psb", "pdf", "svg"],
      fileList: [],
      toFormat: null,
      converting: false,
      loading: null
    };
  },
  computed: {
    fileAccept() {
      var dottedImageExtensions = [];
      for (var imageExtIndex = 0; imageExtIndex < this.imageExtArr.length; imageExtIndex++) {
        dottedImageExtensions.push("." + this.imageExtArr[imageExtIndex]);
      }
      return dottedImageExtensions.join(",");
    },
    imageList() {
      var sourceBlobUrls = [];
      for (var fileListIndex = 0; fileListIndex < this.fileList.length; fileListIndex++) {
        sourceBlobUrls.push(this.fileList[fileListIndex].sourceBlobUrl);
      }
      return sourceBlobUrls;
    },
    convertedCount() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var filteredFiles = this.fileList.filter(fileItem => {
        return fileItem.newBlob != null;
      });
      return filteredFiles.length;
    },
    convertPercent() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var newBlobFiles = this.fileList.filter(fileItem2 => {
        return fileItem2.newBlob != null;
      });
      return newBlobFiles.length + "/" + this.fileList.length;
    }
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
    this.dragEventBind();
  },
  methods: {
    dragEventBind() {
      var that = this;
      function addFilesToList(fileListData) {
        that.addFileListData(fileListData);
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
        var dataTransfer = dropEvent.dataTransfer;
        var droppedFiles = [];
        var processedCount = 0;
        var fileCount = dataTransfer.files.length;
        function handleFileReadComplete() {
          if (processedCount === fileCount - 1) {
            addFilesToList(droppedFiles);
          }
          processedCount++;
        }
        if (dataTransfer.items !== undefined) {
          for (var itemIndex = 0; itemIndex < dataTransfer.items.length; itemIndex++) {
            var dataTransferItem = dataTransfer.items[itemIndex];
            if (dataTransferItem.kind === "file" && dataTransferItem.webkitGetAsEntry().isFile) {
              var transferredFile = dataTransferItem.getAsFile();
              droppedFiles.push(transferredFile);
            }
          }
          addFilesToList(droppedFiles);
        } else {
          for (var itemIndex = 0; itemIndex < fileCount; itemIndex++) {
            var droppedFile = dataTransfer.files[itemIndex];
            if (droppedFile.type) {
              droppedFiles.push(droppedFile);
              handleFileReadComplete();
            } else {
              try {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(droppedFile.slice(0, 3));
                fileReader.addEventListener("load", function (loadEvent) {
                  console.log(loadEvent, "load");
                  droppedFiles.push(droppedFile);
                  handleFileReadComplete();
                }, false);
                fileReader.addEventListener("error", function (errorEvent) {
                  console.log(errorEvent, "error，cannot upload folder");
                  handleFileReadComplete();
                }, false);
              } catch (error) {
                console.log(error, "catch error，cannot upload folder");
                handleFileReadComplete();
              }
            }
          }
        }
      }, false);
    },
    selectImg() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(selectedFiles) {
      this.addFileListData(selectedFiles.target.files);
      document.getElementById("flFile").value = null;
    },
    addFileListData(fileListData) {
      for (var dataIndex = 0; dataIndex < fileListData.length; dataIndex++) {
        var fileExtension = fileListData[dataIndex].name.substring(fileListData[dataIndex].name.lastIndexOf(".") + 1).toLowerCase();
        if (!this.imageExtArr.includes(fileExtension)) {
          continue;
        }
        var filteredFileList = this.fileList.filter(fileItem3 => {
          return fileItem3.name == fileListData[dataIndex].name;
        });
        if (filteredFileList.length > 0) {
          continue;
        }
        this.fileList.push({
          name: fileListData[dataIndex].name,
          sourceFormat: fileExtension,
          newFormat: null,
          originalSize: fileListData[dataIndex].size,
          originalSizeDesc: c.transSizeDesc(fileListData[dataIndex].size, 1),
          newSize: null,
          newSizeDesc: null,
          sourceBlobUrl: URL.createObjectURL(fileListData[dataIndex]),
          newBlob: null
        });
      }
    },
    removeFileListData(fileToRemove) {
      if (this.converting) {
        return;
      }
      if (fileToRemove != null) {
        this.fileList.splice(fileToRemove, 1);
      } else {
        this.$confirm(locales.clearConfirm, locales.alertTitle, {
          confirmButtonText: locales.ok,
          cancelButtonText: locales.cancel
        }).then(() => {
          this.fileList = [];
        });
      }
    },
    convert() {
      if (this.converting) {
        return;
      }
      if (this.toFormat == null) {
        this.$message.error(locales.chooseFormatTip);
        return;
      }
      var updatedFileList = this.fileList.filter(fileItem4 => {
        return fileItem4.newFormat != null;
      });
      if (updatedFileList.length > 0 && updatedFileList[0].newFormat != this.toFormat) {
        for (var loopIndex = 0; loopIndex < this.fileList.length; loopIndex++) {
          this.fileList[loopIndex].newFormat = null;
          this.fileList[loopIndex].newSize = null;
          this.fileList[loopIndex].newSizeDesc = null;
          this.fileList[loopIndex].newBlob = null;
        }
      }
      updatedFileList = this.fileList.filter(fileItem5 => {
        return fileItem5.newBlob == null;
      });
      if (updatedFileList.length == 0) {
        return;
      }
      this.converting = true;
      setTimeout(() => {
        var totalFiles = this.fileList.length;
        function* fileGenerator() {
          for (var generatorIndex = 0; generatorIndex < totalFiles; generatorIndex++) {
            yield processFile(generatorIndex);
          }
        }
        var processFile = currentIndex => {
          if (this.fileList[currentIndex].newBlob != null) {
            processNextFile(currentIndex);
          } else {
            this.loading = this.$loading({
              target: document.querySelectorAll(".file-item")[currentIndex]
            });
            try {
              if (this.fileList[currentIndex].sourceFormat == "webp" && ["webp", "jpg", "jpeg", "png", "gif", "bmp"].includes(this.toFormat) || ["webp", "jpg", "jpeg", "png", "gif", "bmp"].includes(this.fileList[currentIndex].sourceFormat) && this.toFormat == "webp") {
                setTimeout(() => {
                  var imageElement = new Image();
                  imageElement.src = this.fileList[currentIndex].sourceBlobUrl;
                  imageElement.onload = () => {
                    var canvasElement = document.createElement("canvas");
                    canvasElement.width = imageElement.width;
                    canvasElement.height = imageElement.height;
                    var canvasContext = canvasElement.getContext("2d");
                    canvasContext.drawImage(imageElement, 0, 0);
                    var dataUrl = canvasElement.toDataURL("image/" + this.toFormat, 1);
                    this.fileList[currentIndex].newFormat = this.toFormat;
                    this.fileList[currentIndex].newBlob = c.base64ToBlob(dataUrl);
                    this.fileList[currentIndex].newSize = this.fileList[currentIndex].newBlob.size;
                    this.fileList[currentIndex].newSizeDesc = c.transSizeDesc(this.fileList[currentIndex].newSize, 1);
                    processNextFile(currentIndex);
                  };
                }, 50);
              } else {
                fetch(this.fileList[currentIndex].sourceBlobUrl).then(async response => {
                  try {
                    let arrayBuffer = await response.arrayBuffer();
                    let uint8Array = new Uint8Array(arrayBuffer);
                    var uploadFileObjects = [{
                      name: "input." + this.fileList[currentIndex].sourceFormat,
                      content: uint8Array
                    }];
                    var convertCommand = "convert input." + this.fileList[currentIndex].sourceFormat + (this.fileList[currentIndex].sourceFormat == "gif" ? "[0]" : "") + " out." + this.toFormat;
                    if (this.toFormat == "ico") {
                      let previewImage = document.querySelectorAll(".img-box img")[currentIndex];
                      var naturalWidth = previewImage.naturalWidth;
                      var naturalHeight = previewImage.naturalHeight;
                      var targetWidth = 256;
                      var targetHeight = 256;
                      var sourceX = 0;
                      var sourceY = 0;
                      if (naturalWidth < targetWidth && naturalHeight < targetHeight) {
                        sourceX = naturalWidth;
                        sourceY = naturalHeight;
                      } else if (naturalWidth / naturalHeight > targetWidth / targetHeight) {
                        sourceX = targetWidth;
                        sourceY = naturalHeight * targetWidth / naturalWidth;
                      } else {
                        sourceX = naturalWidth * targetHeight / naturalHeight;
                        sourceY = targetHeight;
                      }
                      convertCommand = "convert input." + this.fileList[currentIndex].sourceFormat + (this.fileList[currentIndex].sourceFormat == "gif" ? "[0]" : "") + " -resize " + sourceX + "x" + sourceY + " out." + this.toFormat;
                    }
                    var executeResult = await execute({
                      inputFiles: uploadFileObjects,
                      commands: convertCommand
                    });
                    if (executeResult.outputFiles.length > 0 && executeResult.outputFiles[0].blob != null && executeResult.outputFiles[0].blob.size > 0) {
                      this.fileList[currentIndex].newFormat = this.toFormat;
                      this.fileList[currentIndex].newSize = executeResult.outputFiles[0].blob.size;
                      this.fileList[currentIndex].newSizeDesc = c.transSizeDesc(this.fileList[currentIndex].newSize, 1);
                      this.fileList[currentIndex].newBlob = executeResult.outputFiles[0].blob;
                    }
                    processNextFile(currentIndex);
                  } catch (caughtError1) {
                    processNextFile(currentIndex);
                  }
                });
              }
            } catch (caughtError2) {
              processNextFile(currentIndex);
            }
          }
        };
        var processNextFile = currentFileIndex => {
          if (this.loading) {
            this.loading.close();
            this.loading = null;
          }
          if (currentFileIndex == this.fileList.length - 1) {
            this.converting = false;
            this.$message.success(locales.convertOver);
          } else {
            setTimeout(() => {
              generator.next();
            }, 10);
          }
        };
        var generator = fileGenerator();
        generator.next();
      }, 50);
    },
    download(downloadIndex) {
      var downloadLink = document.createElement("a");
      var downloadFileName = this.fileList[downloadIndex].name.substring(0, this.fileList[downloadIndex].name.lastIndexOf(".") + 1) + this.fileList[downloadIndex].newFormat;
      downloadLink.download = downloadFileName;
      downloadLink.href = URL.createObjectURL(this.fileList[downloadIndex].newBlob);
      downloadLink.click();
    },
    downloadAll() {
      var zipInstance = new JSZip();
      var zipFolder = zipInstance.folder("converted-images");
      for (var zipIndex = 0; zipIndex < this.fileList.length; zipIndex++) {
        if (this.fileList[zipIndex].newBlob == null) {
          continue;
        }
        var zipFileName = this.fileList[zipIndex].name.substring(0, this.fileList[zipIndex].name.lastIndexOf(".") + 1) + this.fileList[zipIndex].newFormat;
        zipFolder.file(zipFileName, this.fileList[zipIndex].newBlob, {
          binary: true
        });
      }
      zipInstance.generateAsync({
        type: "blob"
      }).then(function (downloadResult) {
        saveAs(downloadResult, "converted-images.zip");
      });
    }
  }
}).use(ElementPlus).mount(".main-body");