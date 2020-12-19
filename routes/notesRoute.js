'use Strict'

const notesController = require('../controllers/notesController')

module.exports = function (app) {
    app.get('/api/v1/notes/all',notesController.getAllNotes);
    app.post('/api/v1/notes/save_notes',notesController.createNotes);
    app.put('/api/v1/notes/:id',notesController.updateNote);
    app.get('/api/v1/notes/:id', notesController.getNoteByID);
    app.delete('/api/v1/notes/:id', notesController.deleteNoteByID);
}