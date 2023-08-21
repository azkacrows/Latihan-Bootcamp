const {nanoid} = require('nanoid');
const books = require('./books');

// Handler 1
const addBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
        return response;
    }
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newbooks = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
};

    books.push(newbooks);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
        return response;
    } else {
        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        }).code(500);
        return response;
    }
};

// Handler 2
const getAllBooksHandler = (request, h) => {
    const {
        name,
        reading,
        finished,
    } = request.query;
    if (name) {
        const booksName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        const response = h.response({
            status: 'success',
            data: {
                books: booksName.map((book) => ({
                    id: book.id, // jebakan, kalau book.id tidak work ubah jadi books.id
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        }).code(200);
        return response;
    }
    if (reading) {
        const booksReading = books.filter((book) => Number(book.reading) === Number(reading));
        const response = h.response({
            status: 'success',
            data: {
                books: booksReading.map((book) => ({
                    id: book.id, // jebakan, kalau book.id tidak work ubah jadi books.id
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        }).code(200);
        return response;
    }
    if (finished) {
        const booksFinished = books.filter((book) => Number(book.finished) === Number(finished));
        const response = h.response({
            status: 'success',
            data: {
                books: booksFinished.map((book) => ({
                    id: book.id, // jebakan, kalau book.id tidak work ubah jadi books.id
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        }).code(200);
        return response;
    }
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id, // jebakan, kalau book.id tidak work ubah jadi books.id
                name: book.name,
                publisher: book.publisher,
            })),
        },
    }).code(200);
    return response;
};

// Handler 3
const getBooksByIdHandler = (request, h) => {
    const {id} = request.params;
    const getBookById = books.filter((book) => book.id === id)[0];
    if (getBookById) {
        const response = h.response({
            status: 'success',
            data: {
                book: getBookById,
            },
        }).code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
    return response;
};

// Handler 4
const updateBooksByIdHandler = (request, h) => {
    const {id} = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const index = books.findIndex((book) => book.id === id);
    const updatedAt = new Date().toISOString();

    if (index !== -1) {
        if (!name) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            }).code(400);
            return response;
        }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
        return response;
    }

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
    };
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
    return response;
    }
    const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
    return response;
};

// Handler 5
const deleteBooksByIdHandler = (request, h) => {
    const {id} = request.params;
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
    return response;
};

module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBooksByIdHandler,
    updateBooksByIdHandler,
    deleteBooksByIdHandler,
};
