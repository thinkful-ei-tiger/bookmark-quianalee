import { createBookmark, getBookmarks, deleteBookmark } from "./api.js";
import { items } from "./store.js";

let bookmarks = [];

function renderHomePage() {
  getBookmarks()
    .then((response) => response.json())
    .then((data) => {
      data.map((bookmark) => {
        const bookmarkDetails = `
            <div>
                <h2 class="bookmarkTitle">${bookmark.title}</h2>
                <div class="flex-container hidden">
                    <div>${bookmark.rating}</div>
                    <div>${bookmark.url}</div>
                    <div>${bookmark.desc}</div>
                    <span>
                        <button class="delete" bookmark-id="${bookmark.id}">Delete</input>
                    </span>
                </div>
            </div>
            `;
        $("body").append(bookmarkDetails);
      });
      $("h2.bookmarkTitle").on("click", function (e) {
        $(this).next().toggleClass("hidden");
      });
    });

  const html = `
        <h1>Bookmark App</h1>
        <div class="addbtn">
            <button type="button">Add Bookmark</button>
        </div>
        <div class="dropdown">
            <button class="flex-container id="dropbtn">Filter By</button>
            <div class="dropdown-content">
                <a href="1star">1 star</a>
                <a href="2star">2 star</a>
                <a href="3star">3 star</a>
                <a href="4star">4 star</a>
                <a href="5star">5 star</a>
            </div>   
        </div>
        
    `;

  $("body").html(html);
}

function addBookmarkListener() {
  $("body").on("click", ".addbtn", function () {
    renderForm();
  });
}

function deleteBookmarkListener() {
  $("body").on("click", ".delete", function (e) {
    const id = $(this).attr(`bookmark-id`);
    deleteBookmark(id).then((response) => {
      if (response.ok) {
        bookmarks = bookmarks.filter((bookmark) => {
          return bookmark.id !== id;
        });
        renderHomePage();
      }
    });
  });
}

function renderForm() {
  const html = `
        <h1>Bookmark App</h1>
        <form>
            <div class='title'>
                <label>Bookmark Title</label>
                <input type='text' name='title' id='title'/>
            </div>  

            <div class='url'>
                <label> Enter URL Here</label>
                <input type='text' name='url' id='url'/>
            </div>   
        <br>
            <div class='radio'>
                <label>Select Your Rating</label>
                <input id="1" type='radio' name='rating' value='1'/>
                <input id="2" type='radio' name='rating' value='2'/>
                <input id="3" type='radio' name='rating' value='3'/>
                <input id="4" type='radio' name='rating' value='4'/>
                <input id="5" type='radio' name='rating' value='5'/>
            </div>
        <br>
            <div class='descrip'>
                <label>Leave a Description</label>
                <input type='text' name='description' id='description'/>
            </div>
        <br>
            <div class='submit'>
                <button type="submit">Submit</button>
            </div>
            <div class='hidden' id='formErrorMessage'>
                <p>
                    Please fill in both Title and URL spaces.
                </p>
            </div>
        </form>
    `;
  $("body").html(html);
}

function filterListener1() {
  $(".radio").not("#2", "#3", "#4", "#5", function () {});
}

function submitFormListener() {
  $("body").on("submit", "form", function (event) {
    event.preventDefault();
    let title = $("#title").val();
    let url = $("#url").val();
    let rating = $("[name=rating]:checked").val();
    let description = $("#description").val();
    if (title === "" || url === "") {
      $("#formErrorMessage").removeClass("hidden");
    } else {
      createBookmark(title, url, rating, description).then((response) => {
        if (response.ok) {
          renderHomePage();
        }
      });
    }
  });
}

$(renderHomePage);
$(addBookmarkListener);
$(submitFormListener);
$(deleteBookmarkListener);
$(filterListener1);

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
