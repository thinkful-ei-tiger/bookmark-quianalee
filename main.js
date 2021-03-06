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
        <button class="flex-container id="dropbtn">Filter By</button>
            <div class="dropdown-content">
                <div class='filterInput'>
                    <label>Filter By</label>
                    <input class='filter' type='radio' name='rating' value='1'/>
                    <input class='filter' type='radio' name='rating' value='2'/>
                    <input class='filter' type='radio' name='rating' value='3'/>
                    <input class='filter' type='radio' name='rating' value='4'/>
                    <input class='filter' type='radio' name='rating' value='5'/>
                </div>
            </div>   
    </div>
    </form>
  
`;

  for (let bookmark of items.bookmarks) {
    if (bookmark.rating >= items.filter) {
      bookmarkDetails += `
            <div>
                <h2 class="bookmarkTitle">${bookmark.title} ${bookmark.rating} Stars</h2>
                <div class="flex-container hidden">
                    <div>${bookmark.rating} Stars</div>
                    <div><${bookmark.url}</div>
                    <div>${bookmark.desc}</div>
                    <div><a target="_blank" href="${bookmark.url}">Visit Site</a></div>
                    <span>
                        <button class="delete" bookmark-id="${bookmark.id}">Delete</input>
                    </span>
                </div>
            </div>
            `;
    }
  }

  $("main").html(bookmarkDetails);
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
  $("main").on("click", ".bookmarkTitle", function (e) {
    $(this).next().toggleClass("hidden");
  });
}

function renderForm() {
  const html = `
        <h1>Bookmark App</h1>
        <form>
            <section class="title">
                <label for"title">Bookmark Title</label>
                <input type='text' name='title' id='title'/>
            </section>

            <div class='url'>
                <label for"url"> Enter URL Here</label>
                <input type='text' name='url' id='url'/>
            </div>   
        
            <div class='radio'>
            <label>Select Your Rating</label>
                <input class='radioInput' type='radio' name='rating' value='1'/>
                <input class='radioInput' type='radio' name='rating' value='2'/>
                <input class='radioInput' type='radio' name='rating' value='3'/>
                <input class='radioInput' type='radio' name='rating' value='4'/>
                <input class='radioInput' type='radio' name='rating' value='5'/>
            </div>
        
            <div class='descrip'>
                <label for="description">Leave a Description</label>
                <input type='text' name='description' id='description'/>
            </div>
        
            <div class='submit'>
                <button type="submit">Submit</button>
            </div>
            <div class='hidden' id='formErrorMessage'>
                <p>
                    Please fill in Title.
                </p>
            </div>
            <div class='hidden' id='urlErrorMessage'>
            <p>
                Please use http:// or https://
            </p>
            
        </div>
        </form>
    `;
  $("main").html(html);
}

function filterListener1() {
  $("main").on("click", ".filter", function (e) {
    items.filter = $(e.target).val();
    renderHomePage();
  });
}

function submitFormListener() {
  $("main").on("submit", "form", function (event) {
    event.preventDefault();
    $("#urlErrorMessage").addClass("hidden");
    $("#formErrorMessage").addClass("hidden");
    let title = $("#title").val();
    let url = $("#url").val();
    let rating = $("[name=rating]:checked").val();
    let description = $("#description").val();
    if (urlCheck(url)) {
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
  if (!url.match(/^https?:\/\//)) {
    return true;
  }
  return false;
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
$(filterListener1);
$(handleDetails);

//Mike Stowe TA

/*After I render my form and fill it out, I want to store the information in the store
I need an event listener the the submit button
After I store it, I want to go back to my home page and have my saved bookmark showing
From the home page, I want to be able to click the bookmark to see the description, have a link to the page, and have an option to edit
I need to make the displayed bookmark a dropdown and set up event listeners for the delete and edit buttons
I want to throw an error if the form is not completely filled out, the whole form must be filled out
I need to be able to delete bookmarks in the same place it's offered to edit them
I have to export all my js files to my main js file
I need my main js file to import all of my other js files */
