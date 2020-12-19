const { db } = require("../config/sequelize");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllNotes = catchAsync(async (req, res, next) => {
    res.setHeader('x-no-compression', 'false')
  
    const notes = await db.models.notes.findAll({
        attributes: ['id', 'title', 'content', 'active'],
        where: {
            deletedAt: null
        }
    });

    const payload = 'Too many requests from this IP, please try again after sometime'
    res.send(payload.repeat(20000));
    // if (notes.length === 0) return next(new AppError('No Entries found', 404))

    // res.json({ message: 'Notes Found successfully 😃😄', error: false, notes });
})



exports.getNoteByID = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const notes = await findById(id)

    if (!notes) return next(new AppError('No Entry found with this ID 😞.', 404))

    res.json({ message: 'Note Found successfully 😃😄', error: false, notes });
})


const findById = id => {
    return db.models.notes.findOne({
        attributes: ['id', 'title', 'content', 'active'],
        where: {
            id
        }
    });
}

exports.createNotes = catchAsync(async (req, res, next) => {
    const { title, content, active } = req.body;

    const saveNote = await db.models.notes.create({
        title, content, active
    })

    if (!saveNote) return next(new AppError('Note Created Unsuccessful.', 401));

    res.status(201).json({
        status: 'success',
        message: 'Note Created Successfully 😃.',
        newNote: saveNote
    });
})

exports.updateNote = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, content, active } = req.body;
    const idFound = await findById(id);

    if (!idFound) return next(new AppError('No Entry Found with this ID 😞.', 401));

    const updatedResult = await db.models.notes.update(
        { title, content, active }, {
        where: { id }
    })

    if (!updatedResult) return next(new AppError('Note Update Unsuccessful.', 401));

    const response = await findById(id);

    res.status(201).json({
        status: 'success',
        message: 'Note Updated Successfully 😃.',
        updatedNote: response
    });

})



exports.deleteNoteByID = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const notes = await findById(id);

    if (!notes) return next(new AppError('No Entry found with this ID 😞.', 404));

    const response = await db.models.notes.destroy({
        where: {
            id
        }
    })

    const deleteData = await findById(id);

    if (deleteData === null) return res.json({ message: 'Note Deleted successfully 😃😄', error: false });

})