import { Router } from "express";
import { insert, remove, select, update } from "../../database/mysql";
import multipart from "../middlewares/filestoring/store";
import { resourceOption } from "../../datatypes/types";
import { joinAsync } from "../../database/_modules/tablejoin";

export const users = Router();

const serverError = (res: any, e: any) => {
    console.log(e)
    res.status(500).send({ error: 'Server error.', status: 500, message: e.message })
}

//Use for single method
export const resource = (table: string, options?: resourceOption) => {
    return {
        //MARK: resource GET
        get: async (req: any, res: any) => {

            let where: object;

            if (req.query.where) {
                where = JSON.parse(req.query.where)
            }

            try {
                const { results } = await select(table, { get: req.query.keys || options.keys, where: where, pageSize: req.query.page_size, orderBy: req.query.order_by, order: req.query.order })

                if (results.length === 0) {
                    return res.status(404).send({ error: "Not found.", status: 404, message: "Empty table." })
                }

                if (options.join) {
                    for (const item of options.join) {
                        const { table: joinTable, foreign_key, local_key } = item;
                        const joinResults = await joinAsync(results, joinTable, local_key, foreign_key);
                        // Merge join results into the base results
                        results.forEach((result: any, index: number) => {
                            results[index][joinTable] = joinResults[index][joinTable];
                        });
                    }
                }

                // Set content type to JSON
                res.setHeader('Content-Type', 'application/json');

                // Send the response
                return res.status(200).send({ data: results }, null, 2);
            }
            catch (e) {
                return serverError(res, e)
            }
        },
        //MARK: resource GET by ID
        getId: async (req: any, res: any) => {

            let where: object;

            if (req.query.where) {
                where = JSON.parse(req.query.where)
            }

            try {
                const { results } = await select(table, { get: req.query.keys, where: { id: req.params.id } })
                if (results.length === 0) {
                    return res.status(404).send({ error: "Not found.", status: 404, message: `Records for ${table} with id of ${req.params.id} not found.` })
                }

                if (options.join) {
                    for (const item of options.join) {
                        const { table: joinTable, foreign_key, local_key, join_keys } = item;
                        const joinResults = await joinAsync(results, joinTable, local_key, foreign_key, {keys:join_keys ,where_key: foreign_key, where_value: req.params.id });
                        // Merge join results into the base results
                        results.forEach((result: any, index: number) => {
                            results[index][joinTable] = joinResults[index][joinTable];
                        });
                    }
                }

                // Set content type to JSON
                res.setHeader('Content-Type', 'application/json');

                res.status(200).send({ data: results[0] }, null, 2)
            }
            catch (e) {
                return serverError(res, e)
            }
        },
        //MARK: resource POST
        post: async (req: any, res: any) => {
            try {
                const { results } = await insert(table, req.body)
                res.status(200).send({ data: results, message: "Record created." })
            }
            catch (e) {
                return serverError(res, e)
            }
        },
        //MARK: resource PUT
        put: async (req: any, res: any) => {
            try {
                const { results } = await update(table, Number(req.params.id), req.body)
                res.status(200).send({ data: results, message: "Record updated." })
            }
            catch (e) {
                return serverError(res, e)
            }
        },
        //MARK: resource DELETE
        delete: async (req: any, res: any) => {
            try {
                const { results } = await remove(table, Number(req.params.id))
                res.status(200).send({ data: results, message: "Record deleted." })
            }
            catch (e) {
                return serverError(res, e)
            }
        }
    }
}

//use for all method get, post put delete
export const routerResource = (router: any, table: string, options?: resourceOption) => {
    router.get('/', resource(table, options).get)
    router.get('/:id', resource(table, options).getId)
    router.post('/', multipart.any(), resource(table, options).post)
    router.put('/:id', resource(table, options).put)
    router.delete("/:id", resource(table, options).delete)
}