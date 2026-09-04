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
        var cardElements = document.querySelector(".tool-body .content").querySelectorAll(this.needFindCatdObjList.join(","));
        if (cardElements.length == 0) {
          return;
        }
        var dataMap = {};
        this.needFindCatdObjList.forEach(cardObj => {
          dataMap[cardObj] = 0;
        });
        cardElements.forEach(cardElement => {
          for (var index = 0; index < this.needFindCatdObjList.length; index++) {
            if (this.needFindCatdObjList[index] == cardElement.tagName) {
              dataMap[cardElement.tagName]++;
              break;
            }
          }
        });
        var resultList = [];
        for (var key in dataMap) {
          if (dataMap[key] > 0) {
            resultList.push(key);
          }
        }
        var counter = 0;
        cardElements.forEach(cardNode => {
          cardNode.id = Math.random();
          cardNode.level = resultList.indexOf(cardNode.tagName);
          if (cardNode.tagName == resultList[0]) {
            counter++;
          }
        });
        if (counter > 1) {
          var count = 1;
          cardElements.forEach(cardEl => {
            if (cardEl.tagName == resultList[0]) {
              cardEl.textContent = count + ". " + cardEl.textContent;
              count++;
            }
          });
        }
        this.catObjList = cardElements;
      } catch (error) {
        console.log("error:" + error);
      }
    },
    goPosition(elementId) {
      try {
        var targetElement = document.getElementById(elementId);
        if (!targetElement) {
          return;
        }
        window.scrollTo({
          top: targetElement.offsetTop - 70
        });
      } catch (err) {
        console.log("error:" + err);
      }
    },
    listenerScroll() {
      try {
        var handleCatalogLinkClick = clickEvent => {
          var catalogLinks = document.querySelectorAll(".catalog-list a");
          catalogLinks.forEach(link => {
            if (link.id == "cat-" + clickEvent) {
              link.className = "active";
            } else {
              link.className = "";
            }
          });
        };
        var handleScrollSpy = () => {
          var currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          for (var catIndex = this.catObjList.length - 1; catIndex >= 0; catIndex--) {
            if (parseInt(currentScrollTop) >= Math.ceil(this.catObjList[catIndex].offsetTop) - 70) {
              handleCatalogLinkClick(this.catObjList[catIndex].id);
              return;
            }
          }
        };
        window.addEventListener("scroll", scrollEvent => {
          handleScrollSpy();
        });
        handleScrollSpy();
      } catch (caughtError) {
        console.log("error:" + caughtError);
      }
    }
  }
}).use(ElementPlus).mount(".main-body");