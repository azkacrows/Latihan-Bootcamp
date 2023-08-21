const {
    addBooksHandler,
    getAllBooksHandler,
    getBooksByIdHandler,
    updateBooksByIdHandler,
    deleteBooksByIdHandler,
    } = require('./handler');

    const routes = [
        {
            method: 'POST',
            path: '/books',
            handler: addBooksHandler,
        },
        {
            method: 'GET',
            path: '/books',
            handler: getAllBooksHandler,
        },
        {
            method: 'GET',
            path: '/books/{id}',
            handler: getBooksByIdHandler,
        },
        {
            method: 'PUT',
            path: '/books/{id}',
            handler: updateBooksByIdHandler,
        },
        {
            method: 'DELETE',
            path: '/books/{id}',
            handler: deleteBooksByIdHandler,
        },
    ];
module.exports = routes;
