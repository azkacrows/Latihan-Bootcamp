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

// Mendengarkan event submit pada form.
document.getElementById("inputBook").addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah pengiriman form bawaan.
    createBook();
    resetForm();
    location.reload();
});
// end fungsi membuat buku

// Fungsi untuk update status buku
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
// end Fungsi update status buku

// Fungsi untuk edit buku
function editBookProperty(bookId, propertyName, currentValue) {
    const book = savedBook.find((book) => book.id === bookId);

    const newValue = prompt(`Edit ${propertyName} buku:`, currentValue);

    if (newValue !== null) {
        // Jika pengguna mengklik "OK" pada prompt
        book[propertyName] = newValue;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBook));
        document.dispatchEvent(new Event(UPDATED_EVENT));
        displayBooks();
        location.reload();
    } else {
        // Jika pengguna mengklik "Cancel" od prompt
        return;
    }
}

// end Fungsi edit buku

// Fungsi hapus buku
function removeBook(bookId) {
    savedBook = savedBook.filter((book) => book.id !== bookId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBook));

    document.dispatchEvent(new Event(REMOVED_EVENT));
    alert("Buku berhasil dihapus!");

    displayBooks();

    location.reload();
}
// end Fungsi hapus buku

// Fungsi untuk menambahkan event listeners
function addBookEventListeners() {
    const incompleteRack = document.getElementById("incomplete");
    const completeRack = document.getElementById("complete");

    incompleteRack.addEventListener("click", function (event) {
        const bookId = event.target.dataset.bookId;
        if (bookId) {
            updateBookStatus(bookId);
        }
    });

    completeRack.addEventListener("click", function (event) {
        const bookId = event.target.dataset.bookId;
        if (bookId) {
            updateBookStatus(bookId);
        }
    });
}
