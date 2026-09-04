c.preventCheat();
Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        region: null
      },
      suggestionList: [],
      queryDataHtml: null
    };
  },
  watch: {
    "formData.region"() {
      var regionFlagList = [];
      if (!c.isNullOrEmpty(this.formData.region)) {
        const flagListSpans = document.querySelectorAll("#flag-list li span");
        const lowercaseRegion = this.formData.region.toLowerCase();
        for (let spanIndex = 0; spanIndex < flagListSpans.length; spanIndex++) {
          const spanText = flagListSpans[spanIndex].innerText;
          if (spanText.toLowerCase().indexOf(lowercaseRegion) !== -1) {
            regionFlagList.push(spanText);
          }
        }
      }
      this.suggestionList = regionFlagList;
      this.suggestionsDisplay();
    }
  },
  mounted() {
    const flagItems = document.querySelectorAll("#flag-list li");
    for (let itemIndex = 0; itemIndex < flagItems.length; itemIndex++) {
      const flagItem = flagItems[itemIndex];
      const itemHtml = flagItem.innerHTML;
      if (itemHtml.indexOf("<span>") === -1) {
        const itemText = flagItem.innerText;
        const htmlTagEndIndex = itemHtml.indexOf(">") + 1;
        const processedHtml = itemHtml.substring(0, htmlTagEndIndex) + "<span>" + itemText + "</span>";
        flagItem.innerHTML = processedHtml;
      }
    }
  },
  methods: {
    suggestionsDisplay() {
      if (this.suggestionList.length > 0) {
        c.popupToggle({
          el: ".suggestions",
          toggle: false
        });
      } else {
        document.querySelector(".suggestions").style.display = "none";
      }
    },
    selectSuggestion(suggestion) {
      this.formData.region = suggestion;
      this.search();
      setTimeout(() => {
        document.querySelector(".suggestions").style.display = "none";
      }, 150);
    },
    closeSuggestions() {
      document.querySelector(".suggestions").style.display = "none";
    },
    search() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          this.formData.region = this.formData.region.trim();
          const resultList = [];
          const flagListItems = document.querySelectorAll("#flag-list li");
          const regionLower = this.formData.region.toLowerCase();
          for (let liIndex = 0; liIndex < flagListItems.length; liIndex++) {
            const listItem = flagListItems[liIndex];
            const listItemText = listItem.innerText;
            if (listItemText.toLowerCase().indexOf(regionLower) !== -1) {
              resultList.push(listItem.outerHTML);
            }
          }
          let resultString = "";
          if (resultList.length > 0) {
            resultString += "<ul>";
            for (let resultIndex = 0; resultIndex < resultList.length; resultIndex++) {
              resultString += resultList[resultIndex];
            }
            resultString += "</ul>";
          }
          this.queryDataHtml = c.isNullOrEmpty(resultString) ? locales.noData : resultString;
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");