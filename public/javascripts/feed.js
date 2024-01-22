// feed.js

// Variable to track the current page
let currentPage = 1;

// Function to fetch more feed items from the server
function loadMoreItems() {
  $.ajax({
    url: `/api/feed?page=${currentPage}`,
    method: "GET",
    success: function (data) {
      // Append new feed items to the container
      $("#feed-container").append(data);

      // Increment the current page
      currentPage++;
    },
    error: function (err) {
      console.error("Error fetching more items:", err);
    },
  });
}

// Function to check if the user has reached the bottom of the page
function isBottomOfPage() {
  return (
    $(window).scrollTop() + $(window).height() >= $(document).height() - 100
  );
}

// Event listener for scrolling
$(window).scroll(function () {
  if (isBottomOfPage()) {
    loadMoreItems();
  }
});

// Initial load of items
$(document).ready(function () {
  loadMoreItems();
});
