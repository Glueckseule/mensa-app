/* eslint-env browser */
/* global Daily */

var Daily = Daily || {};

Daily.FilterController = function() {
  "use strict";

  var that = {};

  function initFilterButtons(filters){
    filters.forEach(function (item) {
      item.addEventListener("click", function () {
        if (!this.classList.contains("selected")) {
          Daily.registerFilter(this.getAttribute("data-food-type"));
        }
        manageClassList(filters, this);
      });
    });
  }

  //set and remove visual feedback and remove all filters when day changed
  function manageClassList(filters, item){
    if (item !== undefined) {
      if (item.classList.contains("selected")) {
        item.classList.remove("selected");
        Daily.filterRemoved();
      } else {
        filters.forEach(function(button){
          button.classList.remove("selected");
        });
        item.classList.add("selected");
      }
    } else {
      filters.forEach(function(button){
        button.classList.remove("selected");
      });
    }
  }

  //get all that do not fit the filter
  function filterList(all, specific){
    //first show all list items, then hide all not needed
    for (let i = 0; i < all.length; i++) {
      all[i].classList.remove("hidden");
    }

    if (specific !== undefined) {
      let filteredOut = _.difference(all, specific);
      for (let i = 0; i < filteredOut.length; i++) {
        filteredOut[i].classList.add("hidden");
      }
    }
  }

  that.initFilterButtons = initFilterButtons;
  that.filterList = filterList;
  that.manageClassList = manageClassList;
  return that;
};
