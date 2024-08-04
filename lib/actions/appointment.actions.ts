'use server';

import { ID } from "node-appwrite";
import { database } from "@/lib/appwrite.config";
import { parseStringify } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";

const bucketId = process.env.NEXT_PUBLIC_BUCKET_ID!;
const projectId = process.env.PROJECT_ID!;
const databaseId = process.env.DATABASE_ID!;
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT!;
const collectionId = process.env.APPOINTMENT_COLLECTION_ID!;

export const createAppointment = async (data: CreateAppointmentParams): Promise<Appointment | null> => {
    try {
        const newAppointment = await database.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            data
        );
        return parseStringify(newAppointment) as Appointment
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await database.getDocument(databaseId, collectionId, appointmentId)

        return parseStringify(appointment);
    } catch (error) {
        console.log(error);
    }
}