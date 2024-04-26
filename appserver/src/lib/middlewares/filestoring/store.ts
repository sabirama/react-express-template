import multer from "multer";
import fs from "fs";
import path from "path";

// Function to ensure directory existence
const ensureDirectoryExistence = (filePath: string) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

const storage = multer.diskStorage({
    destination: function (req: any, res: any, callback: Function) {
        const destination = "storage/files";
        ensureDirectoryExistence(destination);
        callback(null, destination);
    },
    
    filename: function (req: any, res: any, callback: Function) {
        callback(null,  Date.now() + res.originalname);
    },
});

const multipart = multer({ storage });

export default multipart;