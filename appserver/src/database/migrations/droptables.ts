import { drop } from "../mysql";

// add table names in the array
const tables = [
    "users",
    "products",
    "images"
]

const dropTables = async (tables: string[]) => {
    await Promise.all(tables.map(table => drop(table)));
}

dropTables(tables)
    .then(() => {
        console.log("Finished dropping tables. Exiting process.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error dropping tables:", error);
        process.exit(1);
    });