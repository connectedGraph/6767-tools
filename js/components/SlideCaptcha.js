var slideCaptcha = {
  props: {
    email: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false,
      popupWidth: null,
      backgroundImg: "",
      backgroundImgWidth: null,
      slideImg: "",
      slideImgWidth: 62,
      slideImgHeight: 160,
      imageScaling: 1,
      msg: "拖动下方滑块完成拼图",
      msgColor: "",
      sliding: false,
      shakeing: false,
      errNum: 0,
      uid: c.getCustomUID(),
      originX: 0,
      x: 0,
      initialXVal: 40,
      msgResetTimeout: null,
      checkSuccess: false
    };
  },
  template: "\n        <div v-if=\"show && backgroundImg!=''\" class=\"sc-popup-box\">\n            <div class=\"sc-popup-mask\"></div>\n            <div class=\"sc-popup\" v-bind:style=\"'width:'+popupWidth+'px;'\">\n                <div class=\"sc-title\">\n                    <div class=\"title\">安全验证</div>\n                    <div class=\"close\" v-on:click=\"close()\">\n                        <div class=\"my-icon my-icon-cuo\"></div>\n                    </div>\n                </div>\n                <div class=\"sc-body\">\n                    <div class=\"sc-tip\">\n                        <div v-bind:class=\"['msg', msgColor]\">{{msg}}</div>\n                        <div class=\"refresh\" v-on:click=\"getCaptcha()\">刷新</div>\n                    </div>\n                    <div class=\"movable-area\">\n                        <div class=\"bg-img-loading\" v-if=\"backgroundImg == ''\">Loading</div>\n                        <img class=\"background-img\" v-else v-bind:src=\"backgroundImg\" />\n                        <div class=\"line\"></div>\n                        <div class=\"movable-div\" v-bind:style=\"'left: '+x+'px;'\" v-on:mousedown=\"touchStart\" v-on:touchstart=\"touchStart\">\n                            <div class=\"huakuai\" v-bind:class=\"{shake:shakeing==true}\">\n                                <div v-if=\"slideImg==''\" v-bind:style=\"'height: '+slideImgHeight+'px;'\"></div>\n                                <img v-else v-bind:src=\"slideImg\" v-bind:style=\"'height: '+slideImgHeight+'px;'\" />\n                                <div class=\"blue\"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div v-if=\"checkSuccess\" class=\"check-success\">\n                        <div class=\"my-icon my-icon-dui\"></div>\n                        <div>验证成功</div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ",
  mounted() {
    this.popupWidth = parseInt(document.body.clientWidth * 0.9, 10);
  },
  beforeDestroy() {
    this.removeEventListeners();
  },
  methods: {
    open() {
      if (c.isNullOrEmpty(this.email) && c.isNullOrEmpty(this.phone)) {
        return;
      }
      this.show = true;
      this.getCaptcha();
    },
    close() {
      this.show = false;
    },
    getCaptcha() {
      c.ajaxGet({
        url: "/Common/GetCaptcha?uid=" + this.uid,
        loadingTarget: ".sc-body"
      }).then(apiResponse => {
        var captchaData = apiResponse.data;
        this.x = this.initialXVal;
        this.errNum = 0;
        this.backgroundImg = captchaData.background;
        this.slideImg = captchaData.slide;
        var imageObj = new Image();
        imageObj.src = captchaData.background;
        imageObj.onload = () => {
          const backgroundImgEl = document.querySelector(".background-img");
          var backgroundWidth = backgroundImgEl.offsetWidth;
          var backgroundHeight = backgroundImgEl.offsetHeight;
          this.backgroundImgWidth = backgroundWidth;
          this.imageScaling = (imageObj.width / backgroundWidth).toFixed(3);
          this.slideImgWidth = parseInt(62 / this.imageScaling, 10);
          this.slideImgHeight = backgroundHeight;
        };
      });
    },
    shake() {
      if (this.shakeing) {
        return;
      }
      this.shakeing = true;
      setTimeout(() => {
        this.shakeing = false;
        this.x = this.initialXVal;
      }, 500);
    },
    removeEventListeners() {
      window.removeEventListener("touchmove", this.touchMove);
      window.removeEventListener("mousemove", this.touchMove);
      window.removeEventListener("touchend", this.touchEnd);
      window.removeEventListener("mouseup", this.touchEnd);
    },
    touchStart(touchStartEvent) {
      if (this.backgroundImg == null || this.backgroundImg == "") {
        return;
      }
      touchStartEvent.preventDefault();
      window.addEventListener("touchmove", this.touchMove);
      window.addEventListener("mousemove", this.touchMove);
      window.addEventListener("touchend", this.touchEnd);
      window.addEventListener("mouseup", this.touchEnd);
      this.originX = touchStartEvent.pageX || touchStartEvent.touches[0].clientX;
      this.sliding = true;
    },
    touchMove(touchMoveEvent) {
      if (!this.sliding) {
        return;
      }
      var touchX = touchMoveEvent.pageX || touchMoveEvent.touches[0].pageX;
      var slideX = touchX - this.originX + this.initialXVal;
      if (slideX >= 0 && slideX <= this.backgroundImgWidth - this.slideImgWidth) {
        this.x = slideX;
      }
    },
    touchEnd() {
      this.sliding = false;
      this.removeEventListeners();
      this.msg = "验证中";
      this.msgColor = "";
      c.ajaxPost({
        url: "/Common/SendCode",
        data: JSON.stringify({
          email: this.email,
          phone: this.phone,
          uid: this.uid,
          x: parseInt(this.x * this.imageScaling, 10)
        }),
        contentType: "application/json",
        loadingTarget: ".sc-body"
      }).then(verifyResponse => {
        if (verifyResponse.data) {
          this.checkSuccess = true;
          setTimeout(() => {
            this.close();
            this.checkSuccess = false;
          }, 1000);
          this.$emit("success");
        } else {
          this.msg = "验证失败，请重试";
          this.msgColor = "red";
          this.shake();
          this.errNum++;
          if (this.errNum >= 2) {
            this.getCaptcha();
            this.errNum = 0;
          }
        }
        if (this.msgResetTimeout != null) {
          clearTimeout(this.msgResetTimeout);
        }
        this.msgResetTimeout = setTimeout(() => {
          this.msg = "拖动下方滑块完成拼图";
          this.msgColor = "";
        }, 2000);
      });
    }
  }
};