import { Router } from "express";
import { createReadStream } from "fs";

const files = Router();

files.get('/:source', (req, res) => {
    const fileStream = createReadStream("./storage/files/" + req.params.source);

    fileStream.on('open', () => {
        res.setHeader('Content-Type', 'image/jpeg');
        fileStream.pipe(res);
    });

    fileStream.on('error', (err) => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
});

export default files;