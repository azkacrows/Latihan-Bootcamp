let STORAGE_KEY = "Bookshelf_App";
let RENDER_EVENT = "render";
let SAVED_EVENT = "saved";
let REMOVED_EVENT = "removed";
let UPDATED_EVENT = "updated";
let BOOK_ITEMID = "itemId";
let savedBook = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function isLocalStorageSupported() {
    const supported = sessionStorage.getItem("isLocalStorageSupported");

    if (supported) {
        return supported === "true";
    }

    try {
        const localStorage = window.localStorage;

        if (localStorage) {
            sessionStorage.setItem("isLocalStorageSupported", "true");

            return true;
        }
    } catch (e) {
        return false;
    }
}
const isSupported = isLocalStorageSupported();

if (isSupported) {
    console.log("Local storage didukung");
} else {
    console.log("Local storage tidak didukung");
}

function createBook() {
    const title = document.getElementById("inputBookTitle").value;
    const subTitle = document.getElementById("inputBookSubTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    const newBook = {
        id: +new Date(),
        title,
        subTitle,
        author,
        year,
        isComplete,
    };

    savedBook.push(newBook);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBook));

    document.dispatchEvent(new Event(SAVED_EVENT));
    alert("Buku telah tersimpan!");
}

function resetForm() {
    const titleInput = document.getElementById("inputBookTitle");
    const subTitleInput = document.getElementById("inputBookSubTitle");
    const authorInput = document.getElementById("inputBookAuthor");
    const yearInput = document.getElementById("inputBookYear");
    const isCompleteInput = document.getElementById("inputBookIsComplete");

    titleInput.value = "";
    subTitleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteInput.checked = false;
}

document.getElementById("inputBook").addEventListener("submit", function (e) {
    e.preventDefault();
    createBook();
    resetForm();
    location.reload();
});

function updateBookStatus(bookId) {
    const book = savedBook.find((book) => book.id === bookId);
    book.isComplete = !book.isComplete;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBook));

    document.dispatchEvent(new Event(UPDATED_EVENT));

    if (!book.isComplete) {
        alert("Buku dipindahkan ke rak belum dibaca.");
    } else {
        alert("Buku dipindahkan ke rak sudah dibaca.");
    }

    location.reload();
}

function editBookProperty(bookId, propertyName, currentValue) {
    const book = savedBook.find((book) => book.id === bookId);

    const newValue = prompt(`Edit ${propertyName} buku:`, currentValue);

    if (newValue !== null) {
        book[propertyName] = newValue;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBook));
        document.dispatchEvent(new Event(UPDATED_EVENT));
        displayBooks();
        location.reload();
    } else {
        return;
    }
}

function removeBook(bookId) {
    savedBook = savedBook.filter((book) => book.id !== bookId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBook));

    document.dispatchEvent(new Event(REMOVED_EVENT));
    alert("Buku berhasil dihapus!");

    displayBooks();

    location.reload();
}

const searchForm = document.getElementById("search-form");
const searchInput = document.querySelector("input[name='search']");

searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const keyword = searchInput.value.toLowerCase();
    const searchResults = searchBooks(keyword);
    displaySearchResults(searchResults);
});

function searchBooks(keyword) {
    const results = savedBook.filter((book) => {
        return (
            book.title.toLowerCase().includes(keyword) ||
            book.subTitle.toLowerCase().includes(keyword) ||
            book.author.toLowerCase().includes(keyword)
        );
    });

    return results;
}

function displaySearchResults(results) {
    const incompleteRack = document.getElementById("incomplete");
    const completeRack = document.getElementById("complete");
    incompleteRack.innerHTML = "";
    completeRack.innerHTML = "";

    results.forEach((book) => {
        const bookContainer = document.createElement("div");
        bookContainer.classList.add("book");

        const title = document.createElement("div");
        title.classList.add("title");
        title.textContent = book.title;
        title.addEventListener("contextmenu", () => {
            editBookProperty(book.id, "title", book.title);
        });

        const subTitle = document.createElement("div");
        subTitle.classList.add("sub-title");
        subTitle.textContent = book.subTitle;
        subTitle.addEventListener("contextmenu", () => {
            editBookProperty(book.id, "subTitle", book.subTitle);
        });

        const details = document.createElement("div");
        details.classList.add("details");

        const removeButton = document.createElement("img");
        removeButton.classList.add("remove");
        removeButton.src = "./assets/img/remove.svg";
        removeButton.addEventListener("click", () => {
            removeBook(book.id);
        });

        const isCompleteButton = document.createElement("img");
        isCompleteButton.classList.add("done");
        isCompleteButton.src = "./assets/img/check.svg";
        if (book.isComplete) {
            isCompleteButton.classList.remove("hidden");
        } else {
            isCompleteButton.classList.add("hidden");
        }
        isCompleteButton.addEventListener("click", () => {
            updateBookStatus(book.id);
        });

        const author = document.createElement("p");
        author.classList.add("author");
        author.textContent = book.author;
        author.addEventListener("contextmenu", () => {
            editBookProperty(book.id, "author", book.author);
        });

        const year = document.createElement("p");
        year.classList.add("year");
        year.textContent = book.year;
        year.addEventListener("contextmenu", () => {
            editBookProperty(book.id, "year", book.year);
        });

        details.appendChild(removeButton);
        details.appendChild(isCompleteButton);
        details.appendChild(author);
        details.appendChild(year);

        bookContainer.appendChild(title);
        bookContainer.appendChild(subTitle);
        bookContainer.appendChild(details);

        if (book.isComplete) {
            completeRack.appendChild(bookContainer);
        } else {
            incompleteRack.appendChild(bookContainer);
        }
    });
}

function displayBooks() {
    const incompleteRack = document.getElementById("incomplete");
    const completeRack = document.getElementById("complete");

    incompleteRack.innerHTML = "";
    completeRack.innerHTML = "";

    savedBook.forEach((book, index) => {
        const bookContainer = document.createElement("div");
        bookContainer.classList.add("book");
        bookContainer.dataset[BOOK_ITEMID] = book.id;

        const title = document.createElement("div");
        title.classList.add("title");
        title.textContent = book.title;
        title.addEventListener("contextmenu", () => {
            editBookProperty(book.id, "title", book.title);
        });

        const subTitle = document.createElement("div");
        subTitle.classList.add("sub-title");
        subTitle.textContent = book.subTitle;
        subTitle.addEventListener("contextmenu", () => {
            editBookProperty(book.id, "subTitle", book.subTitle);
        });

        const details = document.createElement("div");
        details.classList.add("details");

        const author = document.createElement("p");
        author.classList.add("author");
        author.textContent = book.author;
        author.addEventListener("contextmenu", () => {
            editBookProperty(book.id, "author", book.author);
        });

        const year = document.createElement("p");
        year.classList.add("year");
        year.textContent = book.year;
        year.addEventListener("contextmenu", () => {
            editBookProperty(book.id, "year", book.year);
        });

        const isCompleteIcon = document.createElement("img");
        isCompleteIcon.classList.add("done");
        isCompleteIcon.src = book.isComplete
            ? "./assets/img/uncheck.svg"
            : "./assets/img/check.svg";
        isCompleteIcon.addEventListener("click", () => {
            updateBookStatus(book.id);
        });

        const removeIcon = document.createElement("img");
        removeIcon.classList.add("remove");
        removeIcon.src = "./assets/img/remove.svg";
        removeIcon.addEventListener("click", () => {
            removeBook(book.id);
        });

        details.appendChild(author);
        details.appendChild(year);
        details.appendChild(isCompleteIcon);
        details.appendChild(removeIcon);

        bookContainer.appendChild(title);
        bookContainer.appendChild(subTitle);
        bookContainer.appendChild(details);

        if (book.isComplete) {
            completeRack.appendChild(bookContainer);
        } else {
            incompleteRack.appendChild(bookContainer);
        }
    });
}
displayBooks();
