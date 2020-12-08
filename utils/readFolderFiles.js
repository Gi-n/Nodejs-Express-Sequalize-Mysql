const fs = require('fs');

exports.readFiles = async (fileName, removeFile) => {

    const fileExist = await fs.existsSync(removeFile);
    if (fileExist != true) return console.log('File not found, so not deleting 😡.');

    await fs.unlinkSync(removeFile);
    console.log(`${fileName} File deleted successfully 🙂!`);
};
