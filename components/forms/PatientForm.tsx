"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"


const PatientForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    console.log(values)

    try {
      const userData = values;
      
      const user =  await createUser(userData);

      if(user) router.push(`/patients/${user.$id}/register`)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className='header'>Hi there </h1>
            <p className="text-dark-700">Schedule your first appointment</p>
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
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm
