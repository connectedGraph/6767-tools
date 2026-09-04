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
      var regionTablesList = [];
      if (!c.isNullOrEmpty(this.formData.region)) {
        const regionTables = document.querySelectorAll("#region-list table");
        const regionLowerCase = this.formData.region.toLowerCase();
        for (let regionTableIndex = 0; regionTableIndex < regionTables.length; regionTableIndex++) {
          const regionTable = regionTables[regionTableIndex];
          const tableRows = regionTable.querySelectorAll("tr");
          for (let dataRowIndex = 2; dataRowIndex < tableRows.length; dataRowIndex++) {
            const dataRow = tableRows[dataRowIndex];
            const rowCells = dataRow.querySelectorAll("td");
            if (rowCells.length < 2) {
              continue;
            }
            const firstCellText = rowCells[0].innerText;
            const secondCellText = rowCells[1].innerText;
            if (firstCellText.toLowerCase().indexOf(regionLowerCase) !== -1) {
              regionTablesList.push(firstCellText);
            }
            if (secondCellText.toLowerCase().indexOf(regionLowerCase) !== -1) {
              regionTablesList.push(secondCellText);
            }
          }
        }
      }
      this.suggestionList = regionTablesList;
      this.suggestionsDisplay();
    }
  },
  mounted() {
    var regionHeaderTables = document.querySelectorAll("#region-list table");
    for (let headerTableIndex = 0; headerTableIndex < regionHeaderTables.length; headerTableIndex++) {
      const headerTable = regionHeaderTables[headerTableIndex];
      const headerCellElement = headerTable.querySelector("th");
      const iconElement = document.createElement("i");
      iconElement.className = "my-icon my-icon-jiantou-down";
      headerCellElement.appendChild(iconElement);
      headerCellElement.addEventListener("click", function () {
        const currentElement = this;
        const currentRowEl = currentElement.parentElement;
        const siblingRows = Array.from(currentRowEl.parentElement.children).filter(childRowCandidate => childRowCandidate.tagName === "TR");
        const otherRows = siblingRows.filter(rowCandidate => rowCandidate !== currentRowEl);
        if (!otherRows.length) {
          return;
        }
        const otherRowDisplay = getComputedStyle(otherRows[0]).display;
        const innerIcon = currentElement.querySelector("i");
        if (otherRowDisplay === "none") {
          innerIcon.style.transform = "rotate(0deg)";
          otherRows.forEach(rowToShow => rowToShow.style.display = "");
        } else {
          innerIcon.style.transform = "rotate(-90deg)";
          otherRows.forEach(rowToHide => rowToHide.style.display = "none");
        }
      });
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
          const tableConfig = {
            th: [],
            td: []
          };
          const regionTablesData = document.querySelectorAll("#region-list table");
          const lowerRegion = this.formData.region.toLowerCase();
          for (let regionTableIdx = 0; regionTableIdx < regionTablesData.length; regionTableIdx++) {
            const regionTableElement = regionTablesData[regionTableIdx];
            const tableRowElements = regionTableElement.querySelectorAll("tr");
            if (tableConfig.th.length === 0) {
              const secondTableRow = tableRowElements[1];
              const headerCellElements = secondTableRow.querySelectorAll("th");
              tableConfig.th = [headerCellElements[0].textContent, headerCellElements[1].textContent];
            }
            for (let currentDataRowIndex = 2; currentDataRowIndex < tableRowElements.length; currentDataRowIndex++) {
              const dataRowElement = tableRowElements[currentDataRowIndex];
              const dataCellElements = dataRowElement.querySelectorAll("td");
              const firstCellContent = dataCellElements[0].innerText;
              const secondCellContent = dataCellElements[1].innerText;
              const firstCellMatch = firstCellContent.toLowerCase().indexOf(lowerRegion) !== -1;
              const secondCellMatch = secondCellContent.toLowerCase().indexOf(lowerRegion) !== -1;
              if (firstCellMatch || secondCellMatch) {
                tableConfig.td.push(firstCellContent);
                tableConfig.td.push(secondCellContent);
              }
            }
          }
          let tableHtml = "";
          if (tableConfig.td.length > 0) {
            tableHtml += "<table><tr><th>" + tableConfig.th[0] + "</th><th>" + tableConfig.th[1] + "</th></tr>";
            for (let configTdIndex = 0; configTdIndex < tableConfig.td.length; configTdIndex = configTdIndex + 2) {
              tableHtml += "<tr><td>" + tableConfig.td[configTdIndex] + "</td><td>" + tableConfig.td[configTdIndex + 1] + "</td></tr>";
            }
            tableHtml += "</table>";
          }
          this.queryDataHtml = c.isNullOrEmpty(tableHtml) ? locales.noData : tableHtml;
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");