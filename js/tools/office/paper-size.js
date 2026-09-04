c.preventCheat();
Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      needFindCatdObjList: ["H1", "H2", "H3", "H4", "H5", "H6"],
      catObjList: [],
      showRightDrawer: false
    };
  },
  mounted() {
    this.initCatalogObj();
    this.$nextTick(() => {
      setTimeout(() => {
        this.goPosition(location.hash.replace("#", ""));
        this.listenerScroll();
      }, 100);
    });
  },
  methods: {
    initCatalogObj() {
      try {
        var matchedElements = document.querySelector(".tool-body .content").querySelectorAll(this.needFindCatdObjList.join(","));
        if (matchedElements.length == 0) {
          return;
        }
        var resultMap = {};
        this.needFindCatdObjList.forEach(needCardObj => {
          resultMap[needCardObj] = 0;
        });
        matchedElements.forEach(element => {
          for (var index = 0; index < this.needFindCatdObjList.length; index++) {
            if (this.needFindCatdObjList[index] == element.tagName) {
              resultMap[element.tagName]++;
              break;
            }
          }
        });
        var resultList = [];
        for (var key in resultMap) {
          if (resultMap[key] > 0) {
            resultList.push(key);
          }
        }
        var count = 0;
        matchedElements.forEach(currentElement => {
          currentElement.id = Math.random();
          currentElement.level = resultList.indexOf(currentElement.tagName);
          if (currentElement.tagName == resultList[0]) {
            count++;
          }
        });
        if (count > 1) {
          var initialValue = 1;
          matchedElements.forEach(cardElement => {
            if (cardElement.tagName == resultList[0]) {
              cardElement.textContent = initialValue + ". " + cardElement.textContent;
              initialValue++;
            }
          });
        }
        this.catObjList = matchedElements;
      } catch (error) {
        console.log("error:" + error);
      }
    },
    goPosition(targetId) {
      try {
        var targetElement = document.getElementById(targetId);
        if (!targetElement) {
          return;
        }
        window.scrollTo({
          top: targetElement.offsetTop - 70
        });
      } catch (errorObj) {
        console.log("error:" + errorObj);
      }
    },
    listenerScroll() {
      try {
        var eventHandler = event => {
          var catalogLinks = document.querySelectorAll(".catalog-list a");
          catalogLinks.forEach(link => {
            if (link.id == "cat-" + event) {
              link.className = "active";
            } else {
              link.className = "";
            }
          });
        };
        var initCallback = () => {
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          for (var reverseIndex = this.catObjList.length - 1; reverseIndex >= 0; reverseIndex--) {
            if (parseInt(scrollTop) >= Math.ceil(this.catObjList[reverseIndex].offsetTop) - 70) {
              eventHandler(this.catObjList[reverseIndex].id);
              return;
            }
          }
        };
        window.addEventListener("scroll", scrollEvent => {
          initCallback();
        });
        initCallback();
      } catch (errorInfo) {
        console.log("error:" + errorInfo);
      }
    }
  }
}).use(ElementPlus).mount(".main-body");