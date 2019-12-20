/* eslint-env browser */
/* global Daily */

var Daily = Daily || {};

Daily.Menu = function() {
  "use strict";

  var that = {},
    BASE_MENU_URL = "https://regensburger-forscher.de:9001/mensa/uni/{{day}}",
    listOfMenuesLoaded = {},
    WEEKDAYS_SHORT = ["mo", "di", "mi", "do", "fr"],
    WEEKDAYS_LONG = ["monday", "tuesday", "wednesday", "thursday", "friday"],
    saturday = 7,
    sunday = 0;

  function initializeDay(day){
    var weekday;
    if(day !== sunday && day !== saturday){
      weekday = WEEKDAYS_LONG[day-1];
    }
    update(weekday);
    return weekday;
  }

  //send ajax request to get data
  function update(day){
    if (listOfMenuesLoaded[day]) {
      Daily.menuAvailable(listOfMenuesLoaded[day]);
    } else {
      let indexOfDay = WEEKDAYS_LONG.indexOf(day),
        dayShort = WEEKDAYS_SHORT[indexOfDay],
        url = BASE_MENU_URL.replace("{{day}}", dayShort),
        xhttp = new XMLHttpRequest(),
        result;

      function onreadystatechange(){
        if(this.readyState === 4 && this.status === 200){
          result = JSON.parse(xhttp.responseText);
          listOfMenuesLoaded[day] = result;
          replaceIngredients(result);
            Daily.menuAvailable(result);
        }
      }

      xhttp.onreadystatechange = onreadystatechange;
      xhttp.open("GET", url, true);
      xhttp.send();
    }
  }

  function replaceIngredients(result){
    for (let i = 0; i < result.length; i++) {
      result[i].labels = replaceShort(result[i].labels);
    }
  }

  //replace short labels by understandable ones
  function replaceShort(labels){
    var newLabels;
    newLabels = labels.replace(/VG?,VG?,(VG?C?,)?VG?,VG/, "Vegetarisch, Vegan");
    newLabels = newLabels.replace("VG", "Vegan");
    newLabels = newLabels.replace(/V$/, "Vegetarisch");
    newLabels = newLabels.replace(/V,/, "Vegetarisch, ");
    newLabels = newLabels.replace("R", "Rind");
    newLabels = newLabels.replace(/^G/, "Geflügel");
    newLabels = newLabels.replace("BL", "Bioland");
    newLabels = newLabels.replace(/B($|,)/, "Bio, ");
    newLabels = newLabels.replace("A", "mit Alkohol");
    newLabels = newLabels.replace("S", "Schwein");
    newLabels = newLabels.replace("F", "Fisch");

    newLabels = newLabels.replace(",", ", ");
    return newLabels;
  }

  //read the localStorage, if there is already something saved
  function getStorageData(){
    var reviewsStored = localStorage.getItem("reviews");
    if (!reviewsStored) {
      reviewsStored = [];
      localStorage.setItem("reviews", JSON.stringify(reviewsStored));
    } else {
      reviewsStored = JSON.parse(reviewsStored);
    }
    return reviewsStored;
  }

  that.update = update;
  that.initializeDay = initializeDay;
  that.getStorageData = getStorageData;
  return that;
};
