import React from 'react'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from 'react-hook-form'
import Image from 'next/image';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';



export enum FormFieldType {
    INPUT = 'input',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    PHONE_INPUT= 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}

interface Props {
    control: Control<any>;
    fieldType: FormFieldType;
    name: string;
    label?: string;
    iconSrc?: string;
    iconAlt?: string;
    placeholder?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode 
}

const RenderField = ({ field, props}: { field: any, props: Props }) => {
    const { iconSrc, fieldType, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton, children } = props;
    switch(fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image src={iconSrc} alt={iconAlt || 'icon'} height={24} width={24} className='ml-2'/>
                    )}
                    <FormControl>
                        <Input 
                            placeholder={placeholder}
                            { ...field }
                            className='shad-input border-0'
                        />
                    </FormControl>
                </div>
            )
        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput 
                       placeholder={placeholder}
                       defaultCountry='TR'
                       international
                       withCountryCallingCode
                       value={field.value as E164Number | undefined}
                       onChange={field.onChange}
                       className='input-phone'

                    />
                </FormControl>
            )
        case FormFieldType.DATE_PICKER:
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                   <Image src='/assets/icons/calendar.svg' height={24} width={24} alt="calendar" className='ml-2'/>
                   <FormControl>
                      <DatePicker 
                        selected={field.value} 
                        onChange={field.onChange} 
                        dateFormat={dateFormat ?? 'MM/dd/yyyy'}
                        showTimeSelect={showTimeSelect ?? false}
                        timeInputLabel='Time:'
                        wrapperClassName='date-picker'
                       />
                   </FormControl>
                </div>
            )
        case FormFieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null;
        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select 
                       onValueChange={field.onChange} 
                       defaultValue={field.defaultValue}
                    >
                        <FormControl className='shad-select-trigger'>
                            <SelectTrigger>
                               <SelectValue  placeholder={placeholder}/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className='shad-select-content'>
                            {children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )

        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea 
                       placeholder={placeholder}
                       {...field}
                       className='shad-textArea'
                       disabled={props.disabled}
                    />
                </FormControl>
            )
        case FormFieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Checkbox 
                           id={props.name} 
                           checked={field.value} 
                           onCheckedChange={field.onChange}
                        />
                        <label htmlFor={props.name} className='checkbox-label'>
                            {props.label}
                        </label>
                    </div>
                </FormControl>
            )
        default:
            return null;
    }
}

const CustomFormField = (props: Props) => {
    const { control, fieldType, name, label, iconSrc, iconAlt } = props
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='flex-1'>
                    {
                        fieldType !== FormFieldType.CHECKBOX && label && (
                            <FormLabel>{label}</FormLabel>
                        )
                    }

                   <RenderField field={field} props={props}/>
                   <FormMessage className="shad-error" />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField