import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import AppointmentForm from './forms/AppointmentForm'
import { Appointment } from '@/types/appwrite.types'


type Props = {
    type: 'schedule' | 'cancel';
    userId: string;
    patientId: string;
    appointment?: Appointment;
    title: string;
    description: string;
}

const AppointmentModal = ({ type, userId, patientId, title, description, appointment }: Props) => {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' className={`capitalize ${type === 'schedule' && 'text-green-500'}`}>
                    {type}
                </Button>
            </DialogTrigger>
            <DialogContent className='shad-dialog sm:max-w-md'>
                <DialogHeader className='mb-4 space-y-3'>
                    <DialogTitle className='capitalize'>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <AppointmentForm 
                   userId={userId} 
                   patientId={patientId} 
                   type={type}
                   appointment={appointment}
                   setOpen={setOpen}
                />
            </DialogContent>
        </Dialog>

    )
}

export default AppointmentModal