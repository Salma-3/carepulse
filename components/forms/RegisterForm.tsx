"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "../CustomFormField"
import SubmitButton from "@/components/SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormControl } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "@/components/ui/label"
import { SelectItem } from "@/components/ui/select"
import Image from "next/image"
import FileUploader from "@/components/FileUploader"
import { registerPatient } from "@/lib/actions/patient.actions"

type Props = {
    user: User;
}
const RegisterForm = ({ user }: Props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: user.name,
            email: user.email,
            phone: user.phone,
        },
    })

    const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
        setIsLoading(true)
        let formData;

        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type,
            });

            formData = new FormData();
            formData.append('blobFile', blobFile);
            formData.append('fileName', values.identificationDocument[0].name);
        }

        try {
            const patientData = {
                userId: user.$id,
                name: values.name,
                email: values.email,
                phone: values.phone,
                birthDate: new Date(values.birthDate),
                gender: values.gender,
                address: values.address,
                occupation: values.occupation,
                emergencyContactName: values.emergencyContactName,
                emergencyContactNumber: values.emergencyContactNumber,
                primaryPhysician: values.primaryPhysician,
                insuranceProvider: values.insuranceProvider,
                insurancePolicyNumber: values.insurancePolicyNumber,
                allergies: values.allergies,
                currentMedication: values.currentMedication,
                familyMedicalHistory: values.familyMedicalHistory,
                pastMedicalHistory: values.pastMedicalHistory,
                identificationType: values.identificationType,
                identificationNumber: values.identificationNumber,
                identificationDocument: values.identificationDocument
                    ? formData
                    : undefined,
                privacyConsent: values.privacyConsent,
            }

            const patient = await registerPatient(patientData)

            if (patient) router.push(`/patients/${user.$id}/new-appointment`)
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className="space-y-4">
                    <h1 className='header'>Welcome</h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>
                </section>
                <CustomFormField
                    name='name'
                    label='Full name'
                    iconSrc='/assets/icons/user.svg'
                    placeholder="John Doe"
                    iconAlt='user'
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                />
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name='email'
                        label='Email'
                        iconSrc='/assets/icons/email.svg'
                        iconAlt='email'
                        control={form.control}
                        placeholder="johndoe@jsmastery.com"
                        fieldType={FormFieldType.INPUT}
                    />
                    <CustomFormField
                        name='phone'
                        label='Phone Number'
                        control={form.control}
                        placeholder="(555) 123-4522"
                        fieldType={FormFieldType.PHONE_INPUT}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name='birthDate'
                        label='Birth Date'
                        control={form.control}
                        fieldType={FormFieldType.DATE_PICKER}
                    />
                    <CustomFormField
                        name='gender'
                        label='Gender'
                        control={form.control}
                        fieldType={FormFieldType.SKELETON}
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup
                                    className='flex h-11 gap-6 xl:justify-between'
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {GenderOptions.map((option, i) => (
                                        <div key={option + i} className="radio-group">
                                            <RadioGroupItem value={option} id={option} />
                                            <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name='address'
                        label='Address'
                        control={form.control}
                        placeholder="14th Street NYC"
                        fieldType={FormFieldType.INPUT}
                    />
                    <CustomFormField
                        name='occupation'
                        label='Occupation'
                        control={form.control}
                        placeholder="Software Engineer"
                        fieldType={FormFieldType.INPUT}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name='emergencyContactName'
                        label='Emergency contact name'
                        control={form.control}
                        placeholder="Guardian's name"
                        fieldType={FormFieldType.INPUT}
                    />
                    <CustomFormField
                        name='emergencyContactNumber'
                        label='Emergency contact number'
                        control={form.control}
                        placeholder="(555) 123-4522"
                        fieldType={FormFieldType.PHONE_INPUT}
                    />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>
                </section>
                <CustomFormField
                    name='primaryPhysician'
                    label='Primary Phyisician'
                    control={form.control}
                    placeholder="Select a phyisician"
                    fieldType={FormFieldType.SELECT}
                >
                    {
                        Doctors.map(doctor => (
                            <SelectItem key={doctor.name} value={doctor.name}>
                                <div className="flex cursor-pointer items-center gap-2">
                                    <Image src={doctor.image} height={32} width={32} alt='doctor' className="rounded-full border border-dark-500" />
                                    <p>{doctor.name}</p>
                                </div>
                            </SelectItem>
                        ))
                    }
                </CustomFormField>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name='insuranceProvider'
                        label='Insurance Provider'
                        control={form.control}
                        placeholder="BlueCross BlueShield"
                        fieldType={FormFieldType.INPUT}
                    />
                    <CustomFormField
                        name='insurancePolicyNumber'
                        label='Insurance policy number'
                        control={form.control}
                        placeholder="ABC123456789"
                        fieldType={FormFieldType.INPUT}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name='allergies'
                        label='Allergies (if any)'
                        control={form.control}
                        placeholder="Peanuts, Penicillin, Pollen"
                        fieldType={FormFieldType.TEXTAREA}
                    />
                    <CustomFormField
                        name='currentMedication'
                        label='Current medication (if any)'
                        control={form.control}
                        placeholder="Ibuprofen 200mg, Paracetmol"
                        fieldType={FormFieldType.TEXTAREA}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name='familyMedicalHistory'
                        label='Family medical history'
                        control={form.control}
                        placeholder="Mother has brain cancer, Father had heart disease"
                        fieldType={FormFieldType.TEXTAREA}
                    />
                    <CustomFormField
                        name='pastMedicalHistory'
                        label='Past medical history'
                        control={form.control}
                        placeholder="Appendectomy, Tonsillectomy"
                        fieldType={FormFieldType.TEXTAREA}
                    />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification & Verification</h2>
                    </div>
                </section>
                <CustomFormField
                    name='identificationType'
                    label='Identification Type'
                    control={form.control}
                    placeholder="Select ID type"
                    fieldType={FormFieldType.SELECT}
                >
                    {
                        IdentificationTypes.map(idType => (
                            <SelectItem key={idType} value={idType}>
                                <div className="flex cursor-pointer items-center gap-2">
                                    <p>{idType}</p>
                                </div>
                            </SelectItem>
                        ))
                    }
                </CustomFormField>
                <CustomFormField
                    name='identificationNumber'
                    label='Identification number'
                    control={form.control}
                    placeholder="AR320101110"
                    fieldType={FormFieldType.INPUT}
                />

                <CustomFormField
                    name='identificationDocument'
                    label='Scanned copy of identification document'
                    control={form.control}
                    fieldType={FormFieldType.SKELETON}
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader onChange={field.onChange} files={field.value} />
                        </FormControl>
                    )}
                />

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent & Privacy</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    label='I consent to receive treatment for my health condition.'
                    name='treatmentConsent'
                />
                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    label='I consent to disclosure of information.'
                    name='disclosureConsent'
                />
                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    label='I consent to privacy policy'
                    name='privacyConsent'
                />
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterForm
