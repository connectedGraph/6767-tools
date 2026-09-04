c.preventCheat();
var Class = {
  create: function () {
    return function () {
      this.initialize.apply(this, arguments);
    };
  }
};
Object.extend = function (targetObject, sourceObject) {
  for (var propertyKey in sourceObject) {
    targetObject[propertyKey] = sourceObject[propertyKey];
  }
  return targetObject;
};
var Calendar = Class.create();
Calendar.prototype = {
  initialize: function (container, options) {
    this.Container = document.getElementById(container);
    this.Days = [];
    this.SetOptions(options);
    this.Year = this.options.Year;
    this.Month = this.options.Month;
    this.SelectDay = this.options.SelectDay ? new Date(this.options.SelectDay) : null;
    this.onSelectDay = this.options.onSelectDay;
    this.onToday = this.options.onToday;
    this.onFinish = this.options.onFinish;
    this.Draw();
  },
  SetOptions: function (newOptions) {
    var currentDate = new Date();
    this.options = {
      Year: currentDate.getFullYear(),
      Month: currentDate.getMonth() + 1,
      SelectDay: null,
      onSelectDay: function () {},
      onToday: function () {},
      onFinish: function () {}
    };
    Object.extend(this.options, newOptions || {});
  },
  PreMonth: function () {
    var previousMonthFirstDay = new Date(this.Year, this.Month - 2, 1);
    this.Year = previousMonthFirstDay.getFullYear();
    this.Month = previousMonthFirstDay.getMonth() + 1;
    this.Draw();
  },
  NextMonth: function () {
    var nextMonthFirstDay = new Date(this.Year, this.Month, 1);
    this.Year = nextMonthFirstDay.getFullYear();
    this.Month = nextMonthFirstDay.getMonth() + 1;
    this.Draw();
  },
  Draw: function () {
    var calendarCells = [];
    for (var loopIndex = 1, leadingBlankCount = new Date(this.Year, this.Month - 1, 1).getDay(); loopIndex <= leadingBlankCount; loopIndex++) {
      calendarCells.push(" ");
    }
    for (var loopIndex = 1, daysInMonth = new Date(this.Year, this.Month, 0).getDate(); loopIndex <= daysInMonth; loopIndex++) {
      calendarCells.push(loopIndex);
    }
    var documentFragment = document.createDocumentFragment();
    this.Days = [];
    while (calendarCells.length > 0) {
      var tableRow = document.createElement("tr");
      for (var loopIndex = 1; loopIndex <= 7; loopIndex++) {
        var tableCell = document.createElement("td");
        tableCell.innerHTML = " ";
        if (calendarCells.length > 0) {
          var currentCell = calendarCells.shift();
          tableCell.innerHTML = currentCell;
          if (currentCell > 0) {
            this.Days[currentCell] = tableCell;
            if (this.SelectDay && this.IsSame(new Date(this.Year, this.Month - 1, currentCell), this.SelectDay)) {
              this.onSelectDay(tableCell);
            }
          }
        }
        tableRow.appendChild(tableCell);
      }
      documentFragment.appendChild(tableRow);
    }
    while (this.Container.hasChildNodes()) {
      this.Container.removeChild(this.Container.firstChild);
    }
    this.Container.appendChild(documentFragment);
    this.onFinish();
  },
  IsSame: function (dateA, dateB) {
    return dateA.getFullYear() == dateB.getFullYear() && dateA.getMonth() == dateB.getMonth() && dateA.getDate() == dateB.getDate();
  }
};
function getDaysBetween(startDate, endDate) {
  const msPerDay = 86400000;
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  return Math.round((startTime - endTime) / msPerDay);
}
function createCalendar() {
  var calendarInstance = new Calendar("idCalendar", {
    Year: mensesFirstDay.getFullYear(),
    Month: mensesFirstDay.getMonth() + 1,
    onSelectDay: function (selectedDay) {
      selectedDay.className = "onSelect";
    },
    onToday: function (todayValue) {
      todayValue.className = "onToday";
    },
    onFinish: function () {
      document.getElementById("idCalendarYear").innerHTML = this.Year;
      document.getElementById("idCalendarMonth").innerHTML = this.Month;
      var cycleDayThresholds = [10, 15, 20];
      for (var dayLoopIndex = 1, daysCount = this.Days.length; dayLoopIndex < daysCount; dayLoopIndex++) {
        var currentMonth = this.Month;
        var currentDay;
        if ((this.Month + "").length == 1) {
          currentMonth = "0" + this.Month;
        }
        if (dayLoopIndex < 10) {
          currentDay = "0" + dayLoopIndex;
        }
        if (dayLoopIndex >= 10) {
          currentDay = dayLoopIndex;
        }
        var cycleDay = getDaysBetween(new Date(this.Year + "-" + currentMonth + "-" + currentDay), mensesFirstDay) + 1;
        var adjustedCycleDay;
        if (cycleDay <= 0) {
          cycleDay = mensesPeriodDays - Math.abs(cycleDay % 28);
        }
        var cycleDayOffset = cycleDay % mensesPeriodDays;
        if (cycleDayOffset <= mensesDays && cycleDayOffset >= 1) {
          adjustedCycleDay = "bg1";
        } else if (mensesPeriodDays - cycleDayOffset < 9 || mensesPeriodDays - 9 - 10 >= cycleDayOffset) {
          adjustedCycleDay = "bg2";
        } else {
          adjustedCycleDay = "bg3";
        }
        this.Days[dayLoopIndex].innerHTML = "<a class='" + adjustedCycleDay + "' href='javascript:;' onclick='setMensesFirstDay(\"" + (this.Year + "-" + currentMonth + "-" + currentDay) + "\")'>" + dayLoopIndex + "</a>";
      }
    }
  });
  document.getElementById("idCalendarPre").onclick = function () {
    calendarInstance.PreMonth();
  };
  document.getElementById("idCalendarNext").onclick = function () {
    calendarInstance.NextMonth();
  };
}
function setMensesFirstDay(newMensesFirstDay) {
  mensesFirstDay = new Date(newMensesFirstDay);
  createCalendar();
}
var mensesFirstDay;
var mensesPeriodDays;
var mensesDays;
var vueObj = Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      formData: {
        mensesFirstDay: null,
        mensesPeriodDays: 28,
        mensesDays: 5
      },
      showComputeResult: false
    };
  },
  mounted() {},
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          mensesFirstDay = new Date(this.formData.mensesFirstDay);
          mensesPeriodDays = this.formData.mensesPeriodDays;
          mensesDays = this.formData.mensesDays;
          createCalendar();
          this.showComputeResult = true;
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");