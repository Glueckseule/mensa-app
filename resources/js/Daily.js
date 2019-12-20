var Daily = Daily || {};
Daily = (function() {
  "use strict";
  /* eslint-env browser */

  var that = {},
    menu,
    viewController,
    filterController,
    foreground,
    background,
    storageData,
    unfilteredMenu,
    dailyMenuButtons,
    dailyFilterButtons,
    menuListItems;

  function init() {
    var menuContainer = document.querySelector(".daily-menu"),
      exportButton = document.querySelector("header button"),
      entryTemplate = document.querySelector("#menu-entry").innerHTML,
      closeButton = document.getElementById("close"),
      saveButton = document.getElementById("save"),
      dateButton = document.getElementById("date-button"),
      ratingStars = document.getElementById("star-rating");

    foreground = document.getElementById("foreground");
    background = document.getElementById("background");
    dailyMenuButtons = document.querySelectorAll(".day-selector .button");

    initViewController(menuContainer, entryTemplate, dailyMenuButtons, closeButton, saveButton, dateButton);
    initDataProvider();
    initCurrentDay(dailyMenuButtons);
    viewController.initStars(ratingStars);
    viewController.initExportButton(exportButton);
    initFilterController();
  }

  function initViewController(container, template, daybuttons, closeButton, saveButton, dateButton){
    viewController = new Daily.ViewController(container, template);
    viewController.initListener(daybuttons, closeButton, saveButton, dateButton);
  }

  function initDataProvider(){
    menu = new Daily.Menu();
    storageData = menu.getStorageData();
  }

  //filter menu according to settings
  function initFilterController(){
    dailyFilterButtons = document.querySelectorAll(".preference-selector .button-pref");
    filterController = new Daily.FilterController();
    filterController.initFilterButtons(dailyFilterButtons);
  }

  //which day was clicked on?
  function registerDay(event){
    var dayForMenu = event.getAttribute("data-day");
    filterController.manageClassList(dailyFilterButtons);

    dailyFilterButtons[0].parentNode.classList.remove("avoid-clicks");
    menu.update(dayForMenu);
  }

  //by standard show menu for current day
  function initCurrentDay(daybuttons){
    var day = new Date().getDay(),
      dayLong = menu.initializeDay(day);
    viewController.markDay(daybuttons, dayLong);
  }

  //wait till menu data is ready, then show
  function menuAvailable(menu){
    unfilteredMenu = menu;
    viewController.displayMenuForDay(menu);
  }

  //open div in foreground to enter review
  function menuItemClicked(item){
    var doesReviewExist = false;

    //check if there is an item in the localStorage with the same title
    for (let i = 0; i < localStorage.length-1; i++) {
      if (localStorage.key(i) === item.children[1].innerHTML) {
        doesReviewExist = localStorage.key(i);
      }
    }

    //if there is an item with the same title, parse the data existing for it
    if (doesReviewExist) {
      let value = localStorage.getItem(doesReviewExist),
        textarea = foreground.children[0].children[1],
        starRatingArea = foreground.children[0].children[0].children[2];

      value = JSON.parse(value); // value is now a JSON object
      //if there is a rating - color the stars accordingly in the star-rating-area foreground.children[0].children[0].children[1]
      if (value.rating !== undefined) {
        for (let i = 0; i < value.rating; i++) {
          if(starRatingArea.getAttribute("data-id") < value.rating){
            starRatingArea.children[i].classList.add("checked");
          }
        }
      }
      //if there is a text, set the text accordingly to the textarea foreground.children[0].children[1]
      if (value.value !== undefined) {
        textarea.value = value.value;
      }
    }

    background.classList.add("in-background");
    foreground.classList.remove("hidden");

    foreground.children[0].children[0].children[0].innerHTML = item.children[1].innerHTML;
  }

  //gray in background, remove editor window
  function reviewClosed(){
    background.classList.remove("in-background");
    foreground.classList.add("hidden");
  }

  //export local storage so that on deletion no rating is lost
  function onExport(){
    let dataStr = JSON.stringify(localStorage),
      dataUri = "data:application/json;charset=utf-8,"+ encodeURIComponent(dataStr),
      exportFileDefaultName = "data.json",
      linkElement = document.createElement("a");

    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }

  //write review to local storage
  function saveEverything(position, headline){
    var ratingText = document.querySelector("#review-text").value; //the rating for this item to save
    if (ratingText !== "") {
      let ratingObject = { "value": ratingText, "rating" : position };

      localStorage.setItem(headline, JSON.stringify(ratingObject));
      storageData.push(headline);
      localStorage.setItem("reviews", JSON.stringify(storageData));
    } else {
      alert("Gib erst mal dein Rating ein, du Affe!");
    }
  }

  //to filter current food for day according to food preferences
  function filter(type){
      var filteredListitems = [];
      menuListItems = document.querySelectorAll(".daily-menu li");
      for (let i = 0; i < menuListItems.length; i++) {
        if (menuListItems[i].children[2].children[0].innerHTML.includes(type)) {
          filteredListitems.push(menuListItems[i]);
        }
      }
      filterController.filterList(menuListItems, filteredListitems);
  }

  function filterRemoved(){
    filterController.filterList(menuListItems);
    viewController.displayMenuForDay(unfilteredMenu);
  }

  that.init = init;
  that.menuAvailable = menuAvailable;
  that.registerDay = registerDay;
  that.menuItemClicked = menuItemClicked;
  that.reviewClosed = reviewClosed;
  that.saveEverything = saveEverything;
  that.onExport = onExport;
  that.registerFilter = filter;
  that.filterRemoved = filterRemoved;
  return that;
}());
