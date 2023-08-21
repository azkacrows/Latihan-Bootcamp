const fs = require('fs');
const {resolve} = require('path');
async function fileReadData () {
    try {
        const data = await fs.promises.readFile('notes.txt', 'utf8');
        console.log(data);
    } catch (error) {
        console.log('Gagal Membaca berkas:', error);
    }}

// TODO: tampilkan teks pada notes.txt pada console.
fileReadData(resolve(__dirname, 'note.txt'), 'utf8');