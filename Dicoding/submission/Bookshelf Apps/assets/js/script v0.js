let STORAGE_KEY = "Bookshelf_App";
let RENDER_EVENT = "render";
let SAVED_EVENT = "saved";
let REMOVED_EVENT = "removed";
let UPDATED_EVENT = "updated";
let BOOK_ITEMID = "itemId";
let savedBook = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// fungsi check Storage
function isLocalStorageSupported() {
    // Cek apakah ada hasil pengecekan dalam session storage
    const supported = sessionStorage.getItem("isLocalStorageSupported");

    // Jika ada, kembalikan hasil pengecekan tersebut
    if (supported) {
        return supported === "true";
    }

    // Jika tidak, lakukan pengecekan
    try {
        // Buat objek local storage
        const localStorage = window.localStorage;

        // Cek apakah objek local storage ada
        if (localStorage) {
            // Set hasil pengecekan ke dalam session storage
            sessionStorage.setItem("isLocalStorageSupported", "true");

            // Kembalikan true
            return true;
        }
    } catch (e) {
        // Kembalikan false
        return false;
    }
}
const isSupported = isLocalStorageSupported();

if (isSupported) {
    console.log("Local storage didukung");
} else {
    console.log("Local storage tidak didukung");
}
// end fungsi check Storage

// fungsi membuat buku
// Mendapatkan nilai dari formulir.
const titleInput = document.getElementById("inputBookTitle");
const subTitleInput = document.getElementById("inputBookSubTitle");
const authorInput = document.getElementById("inputBookAuthor");
const yearInput = document.getElementById("inputBookYear");
const isCompleteInput = document.getElementById("inputBookIsComplete");

// Mendengarkan event submit pada form.
document.getElementById("inputBook").addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah pengiriman form bawaan.

    // Mengambil nilai dari input fields.
    const title = titleInput.value;
    const subTitle = subTitleInput.value;
    const author = authorInput.value;
    const year = parseInt(yearInput.value);
    const isComplete = isCompleteInput.checked;

    // Membuat objek buku baru.
    const book = createBook(title, subTitle, author, year, isComplete);

    // Menambahkan objek buku baru ke daftar buku yang disimpan.
    savedBook.push(book);

    // Menyimpan daftar buku yang disimpan ke localStorage.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBook));

    // Reset nilai input fields setelah submit.
    titleInput.value = "";
    subTitleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteInput.checked = false;

    // Memicu event "saved".
    const savedEvent = new Event(SAVED_EVENT);
    document.dispatchEvent(savedEvent);

    // Reload tab.
    location.reload();
});

// Fungsi untuk membuat objek buku baru.
function createBook(title, subTitle, author, year, isComplete) {
    // Menggunakan timestamp sebagai ID unik.
    const id = +new Date();

    const book = {
        id,
        title,
        subTitle,
        author,
        year,
        isComplete,
    };

    return book;
}
// end fungsi membuat buku

// Fungsi display buku
function displayBooks() {
    const incompleteRack = document.getElementById("incomplete");
    const completeRack = document.getElementById("complete");

    // Bersihkan rak buku yang sudah ada sebelum menambahkan buku yang baru.
    incompleteRack.innerHTML = "";
    completeRack.innerHTML = "";

    savedBook.forEach((book, index) => {
        const bookContainer = document.createElement("div");
        bookContainer.classList.add("book");
        bookContainer.dataset[BOOK_ITEMID] = book.id;

        // Judul buku
        const title = document.createElement("div");
        title.classList.add("title");
        title.textContent = book.title;

        // Sub-judul buku
        const subTitle = document.createElement("div");
        subTitle.classList.add("sub-title");
        subTitle.textContent = book.subTitle;

        // Detail buku
        const details = document.createElement("div");
        details.classList.add("details");

        // Penulis buku
        const author = document.createElement("p");
        author.classList.add("author");
        author.textContent = book.author;

        // Tahun terbit buku
        const year = document.createElement("p");
        year.classList.add("year");
        year.textContent = book.year;

        // Ikon "check" atau "uncheck"
        const isCompleteIcon = document.createElement("img");
        isCompleteIcon.classList.add("done");
        isCompleteIcon.src = book.isComplete
            ? "./assets/img/uncheck.svg"
            : "./assets/img/check.svg";
        isCompleteIcon.addEventListener("click", () => {
            updateBookStatus(book.id);
        });

        // Ikon "remove"
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

        // Menambahkan buku ke rak yang sesuai (incomplete/complete)
        if (book.isComplete) {
            completeRack.appendChild(bookContainer);
        } else {
            incompleteRack.appendChild(bookContainer);
        }
    });

    // Tambahkan event listeners setelah menambahkan buku
    addBookEventListeners();
}

// Panggil fungsi displayBooks() setelah menambah atau menghapus buku.
displayBooks();
// end Fungsi display buku

// Fungsi untuk update status buku
function updateBookStatus(id) {
    const book = savedBook.find((book) => book.id === id);
    book.isComplete = !book.isComplete;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBook));
    displayBooks();

    const updatedEvent = new Event(UPDATED_EVENT);
    document.dispatchEvent(updatedEvent);

    // Reload tab.
    location.reload();
}
// end Fungsi update status buku

// Fungsi untuk remove buku
function removeBook(id) {
    savedBook = savedBook.filter((book) => book.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBook));

    displayBooks();

    const removedEvent = new Event(REMOVED_EVENT);
    document.dispatchEvent(removedEvent);

    // Reload tab.
    location.reload();
}
// end Fungsi untuk remove buku

// Fungsi untuk menambahkan event listeners
function addBookEventListeners() {
    const incompleteRack = document.getElementById("incomplete");
    incompleteRack.addEventListener("click", function (event) {
        const bookId = event.target.dataset.bookId;
        if (bookId) {
            deleteBook(bookId);
        }
    });
}
// end Fungsi untuk menambahkan event listeners

// Fungsi untuk cari buku
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

        const subTitle = document.createElement("div");
        subTitle.classList.add("sub-title");
        subTitle.textContent = book.subTitle;

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

        const year = document.createElement("p");
        year.classList.add("year");
        year.textContent = book.year;

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
// end fungsi pencarian buku

// Fungsi edit buku
// Fungsi umum untuk mengedit properti buku
function editBookProperty(id, propertyName, currentValue) {
    const book = savedBook.find((book) => book.id === id);

    const newValue = prompt(`Edit ${propertyName} buku:`, currentValue);

    if (newValue !== null) {
        // Jika pengguna mengklik "OK" pada prompt
        book[propertyName] = newValue;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBook));
        displayBooks();
        location.reload();
    } else {
        // Jika pengguna mengklik "Cancel" pada prompt
        return;
    }
}

// Tambahkan event listener untuk klik kanan pada elemen yang ingin diedit
function addEditPropertyEventListeners(selector, propertyName) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
        element.addEventListener("contextmenu", function (event) {
            event.preventDefault(); // Mencegah tampilan konteks browser
            const bookId = event.target.parentElement.dataset[BOOK_ITEMID];
            const currentValue = event.target.textContent;
            editBookProperty(bookId, propertyName, currentValue);
        });
    });
}

// Panggil fungsi addEditPropertyEventListeners() untuk berbagai properti
addEditPropertyEventListeners(".title", "title");
addEditPropertyEventListeners(".sub-title", "subTitle");
addEditPropertyEventListeners(".author", "author");
addEditPropertyEventListeners(".year", "year");
