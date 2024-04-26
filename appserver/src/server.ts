import { Application } from "express";
import api from "./routes/api";
import bodyParser from "body-parser";
import { config } from "dotenv";
import appAuth from "./lib/middlewares/authentiction/appauth";

config();

const port = process.env.APP_PORT;
const server: Application = require("express")();

server
    .use(appAuth)
    .use(bodyParser.json()) // Parse incoming requests with JSON payloads.
    .use(bodyParser.urlencoded({ extended: true }))
    .use("/api", api)
    .use((req,res)=>{res.status(404).send("<h1>404. NOT FOUND.</h1><p>Page does not exist.</p>")})

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
