'use server';
import { ID, Query } from "node-appwrite"
import { BUCKET_ID, database, DATBASE_ID, PATIENT_COLLECTION_ID, ENDPOINT, storage, users, PROJECT_ID } from "@/lib/appwrite.config"
import { parseStringify } from "@/lib/utils";
import { InputFile } from 'node-appwrite/file';

const bucketId = process.env.NEXT_PUBLIC_BUCKET_ID!;
const projectId = process.env.PROJECT_ID!;
const databaseId = process.env.DATABASE_ID!;
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT!;
const collectionId = process.env.PATIENT_COLLECTION_ID!;

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name);
        console.log(newUser)
        return parseStringify(newUser) as User;
    } catch (error: any) {
        if(error && error?.code === 409) {
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])

            return documents?.users[0]
        }
        console.error("An error occurred while creating a new user:", error);
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);

        return parseStringify(user);
    } catch (error) {
        console.log(error)
    }
}

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        console.log('database id', databaseId)
        let file;

        if(identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string
            )

            file = await storage.createFile(bucketId, ID.unique(), inputFile)
        }

        const newPatient = await database.createDocument(
            databaseId, 
            collectionId, 
            ID.unique(), {
            identificationDocumentId: file?.$id || null,
            identificationDocumentUrl: `${endpoint}/storage/buckets/${bucketId}/files/${file?.$id}/view?project=${projectId}`,
            ...patient
        })

        return parseStringify(newPatient)
    } catch (error) {
        console.log(error)
    }
}

export const getPatient = async (userId: string) => {
    try {
        const patients = await database.listDocuments(databaseId, collectionId, [ Query.equal('userId', userId) ]);

        if(!patients.documents[0])
           throw new Error('Not Found');
        
        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.log(error)
    }
}