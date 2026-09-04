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
        var contentCards = document.querySelector(".tool-body .content").querySelectorAll(this.needFindCatdObjList.join(","));
        if (contentCards.length == 0) {
          return;
        }
        var cardMap = {};
        this.needFindCatdObjList.forEach(needFindCardObj => {
          cardMap[needFindCardObj] = 0;
        });
        contentCards.forEach(contentCard => {
          for (var cardIndex = 0; cardIndex < this.needFindCatdObjList.length; cardIndex++) {
            if (this.needFindCatdObjList[cardIndex] == contentCard.tagName) {
              cardMap[contentCard.tagName]++;
              break;
            }
          }
        });
        var validTagNames = [];
        for (var objectKey in cardMap) {
          if (cardMap[objectKey] > 0) {
            validTagNames.push(objectKey);
          }
        }
        var count = 0;
        contentCards.forEach(cardElement => {
          cardElement.id = Math.random();
          cardElement.level = validTagNames.indexOf(cardElement.tagName);
          if (cardElement.tagName == validTagNames[0]) {
            count++;
          }
        });
        if (count > 1) {
          var cardLoopIndex = 1;
          contentCards.forEach(cardItem => {
            if (cardItem.tagName == validTagNames[0]) {
              cardItem.textContent = cardLoopIndex + ". " + cardItem.textContent;
              cardLoopIndex++;
            }
          });
        }
        this.catObjList = contentCards;
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
      } catch (error2) {
        console.log("error:" + error2);
      }
    },
    listenerScroll() {
      try {
        var setupCatalogLinks = param0 => {
          var catalogLinks = document.querySelectorAll(".catalog-list a");
          catalogLinks.forEach(catalogLink => {
            if (catalogLink.id == "cat-" + param0) {
              catalogLink.className = "active";
            } else {
              catalogLink.className = "";
            }
          });
        };
        var handleScrollAndCatalog = () => {
          var scrollTopPos = document.documentElement.scrollTop || document.body.scrollTop;
          for (var catIndex = this.catObjList.length - 1; catIndex >= 0; catIndex--) {
            if (parseInt(scrollTopPos) >= Math.ceil(this.catObjList[catIndex].offsetTop) - 70) {
              setupCatalogLinks(this.catObjList[catIndex].id);
              return;
            }
          }
        };
        window.addEventListener("scroll", scrollEvent => {
          handleScrollAndCatalog();
        });
        handleScrollAndCatalog();
      } catch (error3) {
        console.log("error:" + error3);
      }
    }
  }
}).use(ElementPlus).mount(".main-body");