import { createBookmark, getBookmarks, deleteBookmark } from "./api.js";
import { items } from "./store.js";
import { urlIssue } from "./state.js";

function renderHomePage() {
  let bookmarkDetails = `
  <h1>Bookmark App</h1>
  <div class="addbtn">
      <button type="button">Add Bookmark</button>
  </div>
  <form>
    <div class="dropdown">
        <button type="button" class="flex-container" id="dropbtn">Filter By</button>
            <div class="dropdown-content hidden" id="filter">
                <div class='filterInput'>
                    <label>Filter By</label>
                    <select type="dropdown" id="filter-dropdown">
                        <option label="1star" value="1">1 Star</option>
                        <option label="2star" value="2">2 Star</option>
                        <option label="3star" value="3">3 Star</option>
                        <option label="4star" value="4">4 Star</option>
                        <option label="5star" value="5">5 Star</option>
                    </select>
                </div>
            </div>   
    </div>
  </form>
  
`;

  for (let bookmark of items.bookmarks) {
    if (bookmark.rating >= items.filter) {
      bookmarkDetails += `
            <div>
                <h2 label="title" tabindex="0" class="bookmarkTitle">${bookmark.title} ${bookmark.rating} Stars</h2>
                <section class="details hidden">
                  <span class="flex-container">
                    <h4 tabindex="0">${bookmark.rating} Stars</h4>
                    <p tabindex="0"><${bookmark.url}</p>
                    <div tabindex="0">${bookmark.desc}</div>
                    <a target="_blank" href="${bookmark.url}">Visit Site</a>
                  </span>
                </section>
                    
                        <button tabindex="0" type="button" class="moreInfo">More/Less Details</button>
                   
                        <button tabindex="0" type="button" class="delete" bookmark-id="${bookmark.id}">Delete</button>
                  
              </div>
            `;
    }
  }

  $("main").html(bookmarkDetails);
  $(`option[value="${items.filter}"]`).attr("selected", true);
}

function renderForm() {
  const html = `
        <h1>Bookmark App</h1>
        <form id="sumbit">
            <section class="title">
                <label for="title">Bookmark Title</label>
                <input type='text' name='title' id='title'/>
            </section>
            <section class='url'>
                <label for="url"> Enter URL Here</label>
                <input type='text' name='url' id='url'/>
            </section>   
        
            <label for="rating">Select Your Rating</label>
              <input id="star1" class='radioInput' type='radio' name='rating' value='1'/>
                <label for="star1">1 Star</label>
              <input id="star2" class='radioInput' type='radio' name='rating' value='2'/>
                <label for="star2">2 Star</label>
              <input id="star3" class='radioInput' type='radio' name='rating' value='3'/>
                <label for="star3">3 Star</label>
              <input id="star4" class='radioInput' type='radio' name='rating' value='4'/>
                <label for="star4">4 Star</label>
              <input id="star5" class='radioInput' type='radio' name='rating' value='5'/>
                <label for="star5">5 Star</label>
            </label>
            <section class='descrip'>
                <label for="description">Leave a Description</label>
                <input type='text' name='description' id='description'/>
            </section>
                <button type="submit">Submit</button>            
            <section class='hidden' id='formErrorMessage'>
                <p>
                    Please fill in Title.
                </p>
            </section>
            <section class='hidden' id='urlErrorMessage'>
            <p>
                Please use http:// or https://
            </p>
            </section>
        </form>
    `;
  $("main").html(html);
}

function addBookmarkListener() {
  $("main").on("click", ".addbtn", function () {
    renderForm();
  });
}

function deleteBookmarkListener() {
  $("main").on("click", ".delete", function (e) {
    const id = $(this).attr(`bookmark-id`);
    deleteBookmark(id).then((response) => {
      if (response.ok) {
        items.bookmarks = items.bookmarks.filter((bookmark) => {
          return bookmark.id !== id;
        });
        renderHomePage();
      }
    });
  });
}

function handleDetails() {
  $("main").on("click", ".moreInfo", function (e) {
    $(e.target).parent().find("section").toggleClass("hidden");
  });
}

function handleFilterDropdown() {
  $("main").on("change", "#filter-dropdown", function (e) {
    console.log($(e.target).val());
    items.filter = $(e.target).val();
    renderHomePage();
  });
}

function handleFilterButton() {
  $("main").on("click", "#dropbtn", function (e) {
    console.log("filter");
    $("#filter").removeClass("hidden");
  });
}

function submitFormListener() {
  $("main").on("submit", function (event) {
    event.preventDefault();
    $("#urlErrorMessage").addClass("hidden");
    $("#formErrorMessage").addClass("hidden");
    let title = $("#title").val();
    let url = $("#url").val() || "";
    let rating = $("[name=rating]:checked").val();
    let description = $("#description").val();
    if (urlCheck(url)) {
      console.log(1);
      $("#urlErrorMessage").removeClass("hidden");
    } else if (title === "") {
      $("#formErrorMessage").removeClass("hidden");
    } else {
      createBookmark(title, url, rating, description)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          items.bookmarks.push(data);
          renderHomePage();
        });
    }
  });
}

function urlCheck(url) {
  if (!url.includes("https://") && !url.includes("http://")) {
    return true;
  } else {
    return false;
  }
}

function initialize() {
  getBookmarks()
    .then((res) => res.json())
    .then((data) => {
      data.forEach((current) => {
        items.bookmarks.push(current);
      });
      renderHomePage();
    });
}

$(initialize);
$(renderHomePage);
$(addBookmarkListener);
$(submitFormListener);
$(deleteBookmarkListener);
$(handleFilterDropdown);
$(handleFilterButton);
$(handleDetails);
