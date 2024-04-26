import { Router } from "express";
import { insert, select } from "../../database/mysql";
import { hashText } from "../../lib/middlewares/encryption/bcryptencryption";
import { resource } from "../../lib/resource/controllerTemplate";
import multipart from "../../lib/middlewares/filestoring/store";

// MARK: ROUTER
export const users = Router();

const userResource = resource("users")

const serverError = (res: any, e: any) => {
    console.log(e)
    res.status(500).send({ error: 'Server error.', status: 500, message: e.message })
}

// MARK: GET ROUTE
users.get('/', async (req, res) => {
    try {
        const { results } = await select('users', { get: "id, username, email, created_at, updated_at" }) //hide password
        if (results.length === 0) {
            return res.status(404).send({ error: "Not found.", status: 404, message: "Empty table." })
        }
        res.status(200).send({ data: results })
    }
    catch (e) {
        return serverError(res, e)
    }
})

// MARK: GET BY ID ROUTE
users.get('/:id', async (req, res) => {
    try {
        const { results } = await select('users', { where: { id: req.params.id }, get: "id, username, email, created_at, updated_at" }) //hide password
        if (results.length === 0) {
            return res.status(404).send({ error: "Not found.", status: 404, message: `Records for user with id of ${req.params.id} not found.` })
        }
        res.status(200).send({ data: results[0] })
    }
    catch (e) {
        return serverError(res, e)
    }
})

// MARK: POST ROUTE
users.post('/register', multipart.any(), async (req, res) => {
    try {
        // Remove password from req.body before hashing
        const { password, ...userData } = req.body;

        // Hash the password
        const hashedPassword = await hashText(password);

        // Insert user data with hashed password
        const { results } = await insert('users', { ...userData, password: hashedPassword });

        res.status(200).send({ data: results, message: "Record created." });
    } catch (e) {
        return serverError(res, e);
    }
});

// MARK: PUT ROUTE
users.put('/:id', userResource.put)

// MARK: DELETE ROUTE
users.delete("/:id", userResource.delete)