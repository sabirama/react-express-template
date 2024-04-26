import { google } from "googleapis";
import { createReadStream } from "fs";
import { config } from "dotenv";

config();
// MARK: CONFIG
// Create an OAuth2 client with the given access token and refresh token
const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Set the access token and refresh token directly
oAuth2Client.setCredentials({
    access_token: process.env.GOOGLE_ACCESS_TOKEN,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Create a new instance of Drive
const drive = google.drive({
    version: "v3",
    auth: oAuth2Client,
});

// MARK: UPLOAD FILE
export const uploadFile = async (filename: string, mimetype: string) => {
    const { data } = await drive.files.create({
        requestBody: {
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
            name: filename,
            mimeType: mimetype,
        },
        media: {
            body: createReadStream(`./storage/files/${filename}`),
            mimeType: mimetype,
        },
    });
    return data;
};

// MARK: GENERATE URL
export const generatePublicUrl = async (imageId: string) => {
    try {
        //first edit permission for file in google drive into public
        const create = await drive.permissions.create({
            fileId: imageId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });
        
        //then create a URI
        if (create) {
            const result = await drive.files.get({
                fileId: imageId,
                fields: "id",
            });
            return result;
        }
    } catch (error) {
        return error;
    }
};

// MARK: DELETE FILE
export const deleteFile = async (file: string) => {
    //takes in an image id from google = String(file) to delete file.
    const { data } = await drive.files.delete({
        fileId: file,
    });
    return data;
};

/**
 * @param {string} folderId - google folder id to be viewed.
 * @example
    const folder = async () => {
      const data = await viewFolder("google_folder_id");
      return data;
    }
 */

//MARK: VIEW FOLDER 
// List files in a specific folder
export const viewFolder = async (folderId: string) => {
    drive.files.list(
        {
            q: `'${folderId || process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`,
            fields: `files(name, id)`,
        },
        (err: any, res: any) => {
            if (err) {
                return err
            } else {
                const files = res.data.files;
                if (files && Array.isArray(files) && files.length > 0) {
                    let filesRes = [];
                    files.forEach((file) => {
                        filesRes.push({ name: file.name, id: file.id });
                    });
                    return filesRes;
                } else {
                    return new Error("No files in the folder.");
                }
            }
        }
    );
};