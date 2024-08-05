'use server';

import { ID, Query } from "node-appwrite";
import { database } from "@/lib/appwrite.config";
import { parseStringify } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

const databaseId = process.env.DATABASE_ID!;
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

export const getRecentAppointments = async () => {
    try {
        const appointments = await database.listDocuments(databaseId, collectionId, [Query.orderDesc('$createdAt')])

        const initialCount = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if(appointment.status === 'scheduled') {
                acc.scheduledCount += 1
            } else if(appointment.status === 'pending') {
                acc.pendingCount += 1
            } else if (appointment.status === 'cancelled') {
                acc.cancelledCount += 1
            }
            return acc;
        }, initialCount)

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }

        return parseStringify(data);
    } catch (error) {
        console.log(error)
    }
}

export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await database.updateDocument(databaseId, collectionId, appointmentId, appointment)

        if(!updateAppointment) throw new Error('Appointment Not Found!!')

        //sms notification

        revalidatePath('/admin')
        return parseStringify(updatedAppointment)
    } catch (error) {
        console.log(error)
    }
}