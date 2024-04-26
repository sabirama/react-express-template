import { select } from "../mysql";

type joinOptions = { keys: string, where_key: string, where_value: any }

// Define the join function
export async function joinAsync(objectArr: Array<object>, joinTable: string, localKey: string, foreignKey: string, options?: joinOptions) {
    const sqlOptions = options ? { get: options.keys, where: { [options?.where_key]: options?.where_value } } : null
    const joinData = await select(joinTable, sqlOptions);
    const joinedArray = [];

    objectArr.forEach(element => {
        const matchingData = joinData.results.filter((joinKey: any) => element[localKey] === joinKey[foreignKey]);
        const joinedObject = { ...element };
        joinedObject[joinTable] = matchingData;
        joinedArray.push(joinedObject);
    });

    return joinedArray;
}