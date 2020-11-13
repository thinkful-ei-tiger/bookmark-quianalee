import { bookmarks } from "./state.js";

let bookmarkUrl = "https://thinkful-list-api.herokuapp.com/quianalee/bookmarks";
//https://thinkful-list-api.herokuapp.com/linda/bookmarks

function createBookmark(title, url, rating, description) {
  console.log(title, url, rating, description);
  let obj = {
    title: title,
    url: url,
    rating: rating,
    desc: description,
  };
  console.log(JSON.stringify(obj));
  return fetch(bookmarkUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  });
}

function getBookmarks() {
  return fetch(bookmarkUrl, {
    method: "GET",
  });
}

const deleteBookmark = function (id) {
  return fetch(`${bookmarkUrl}/${id}`, {
    method: "DELETE",
  });
};

export { createBookmark, getBookmarks, deleteBookmark };
