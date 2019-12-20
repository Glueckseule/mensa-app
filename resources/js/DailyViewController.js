/* eslint-env browser */
/* global Daily */

var Daily = Daily || {};

Daily.ViewController = function(container, template) {
  "use strict";

  var that = {},
    onMenuReady = new Event("menuReady"),
    clicked = false,
    starRating,
    starRatingSet, //how many stars to save in storage
    currentItemToSave; //what is the title of the menu item

  //init listeners for buttons
  function initListener(days, close, save, date){
    days.forEach(function (item) {
      item.addEventListener("click", function () {
        manageClassList(days, this);
        Daily.registerDay(this);
      });
    });

    close.addEventListener("click", function(){
      closeReviewWindow("close");
    });
    save.addEventListener("click", function(){
      closeReviewWindow("save");
    });

    date.addEventListener("click", function(){
      var date = getFormattedDate();
      document.querySelector("#review-text").value += date;
    });

    container.addEventListener("menuReady", setListItemListeners);
  }

  //select day of week
  function manageClassList(allButtons, item){
    allButtons.forEach(function(button){
      button.classList.remove("selected");
    });
    item.classList.add("selected");
  }

  function displayMenuForDay(data){
    while( container.firstChild ){
      container.removeChild( container.firstChild );
    }
    if (data.length !== 0) {
      for (let i = 0; i < data.length; i++) {
        let createEntryTemplate = _.template(template),
          entryNode = document.createElement("div");

        entryNode.innerHTML = createEntryTemplate(data[i]);
        container.appendChild(entryNode.children[0]);
      }
    }
    container.dispatchEvent(onMenuReady);
  }

  function markDay(buttons, day){
    for (let i = 0; i < buttons.length; i++) {
      if(buttons[i].getAttribute("data-day") === day){
        buttons[i].classList.add("selected");
      }
    }
  }

  //set clicklistener for each menu item
  function setListItemListeners(){
    var listItems = document.querySelectorAll(".entry");
    for (let i = 0; i < listItems.length; i++) {
      listItems[i].addEventListener("click", function(){
        currentItemToSave = this.children[1].innerHTML;
        Daily.menuItemClicked(this);
      });
    }
  }

  //close review editor and save if save-button pressed
  function closeReviewWindow(type){
    if (type === "save") {
      Daily.saveEverything(starRatingSet, currentItemToSave);
    }
    Daily.reviewClosed();
    clicked = false;
    decolorStars(starRating);

    document.querySelector("#review-text").value = "";
  }

  function initExportButton(button){
    button.addEventListener("click", function(){
      Daily.onExport();
    });
  }

  function initStars(stars){
    starRating = stars;
    for (let i = 0; i < stars.children.length; i++) {
      stars.children[i].addEventListener("mouseover", function(){
        colorStars(stars.children[i].getAttribute("data-id"), stars, "hover");
      });
      stars.children[i].addEventListener("mouseout", function(){
        decolorStars(stars);
      });
      stars.children[i].addEventListener("click", function(){
        colorStars(stars.children[i].getAttribute("data-id"), stars, "click");
      });
    }
  }

  //animation for coloring stars on hover or on click
  function colorStars(position, stars, type) {
    if (type === "click") {
      clicked = true;
      starRatingSet = position;
    }
    for (let i = 0; i < stars.children.length; i++) {
      if(stars.children[i].getAttribute("data-id") <= position){
        stars.children[i].classList.add("checked");
      }
    }
  }

  //remove color from stars when editor window closed
  function decolorStars(stars){
    if (clicked === false) {
      for (let i = 0; i < stars.children.length; i++) {
        stars.children[i].classList.remove("checked");
      }
    }
  }

  function getFormattedDate(){
    var date = new Date(),
      dateString = ("0" + date.getDate()).slice(-2) + "." + ("0"+(date.getMonth()+1)).slice(-2) + "." + date.getFullYear();

    // return day + "." + monthIndex + "." + year;
    return dateString;
  }

  that.displayMenuForDay = displayMenuForDay;
  that.initListener = initListener;
  that.initStars = initStars;
  that.initExportButton = initExportButton;
  that.markDay = markDay;
  return that;
};
