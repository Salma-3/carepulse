import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import StatCard from '@/components/StatCard';
import { getRecentAppointments } from '@/lib/actions/appointment.actions';
import { DataTable } from '@/components/DataTable';
import { columns } from '@/components/table/columns';

type Props = {}



const Admin = async (props: Props) => {

    const { documents, scheduledCount, pendingCount, cancelledCount } = await getRecentAppointments();
    
  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
        <header className='admin-header'>
            <Link href='/' className='cursor-pointer'>
              <Image src='/assets/icons/logo-full.svg' height={32} width={162} alt='logo' className='h-8 w-fit'/>
            </Link>
            <p className="text-16-semibold">Admin Dashboard</p>
        </header>

        <main className="admin-main">
            <section className="w-full space-y-4">
                <h1 className="header">Welcome 👋🏼</h1>
                <p className="text-dark-700">Start the day with managing new appointments</p>
            </section>
            <section className="admin-stat">
                <StatCard type='appointments' count={scheduledCount} label='Scheduled appointments' icon='/assets/icons/appointments.svg'/>
                <StatCard type='pending' count={pendingCount} label='Pending appointments' icon='/assets/icons/pending.svg'/>
                <StatCard type='cancelled' count={cancelledCount} label='Cancelled appointments' icon='/assets/icons/cancelled.svg'/>
            </section>

            <DataTable columns={columns} data={documents}/>
        </main>
    </div>
  )
}

export default Admin