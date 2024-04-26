import fs from "fs";

// Function to delete a file
const deleteFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err}`);
        } else {
            console.log(`File ${filePath} deleted.`);
        }
    });
};

export default deleteFile;