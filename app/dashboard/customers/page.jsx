"use client"

import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./components/column";
import PageContainer from '@/components/page-container'
import TableSkeleton from '@/components/table-skeleton'

const CustomersPage = () => {
  const [ data, setData] = useState([])
  const [ loading, setLoading ] = useState(true)

  const getData = async () => {
    try {
      const response = await fetch("/api/data/customers", { method: "GET" });

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error('Gagal mendapatkan akses token baru:', error.message);
      throw error;
    } finally {
      setLoading(false)
    };
  };
  
  useEffect(() => {
    getData()
  }, [])

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Customers"
            description="List of customer"
          />
          <Link
            href="/dashboard/customers/add"
            className={cn(buttonVariants())}
            title="Add Customers"
          >
            <Plus className="h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        {!loading ? (
          <DataTable data={data} columns={columns} searchKey="name" />
        ) : (
          <TableSkeleton columnCount={4} rowCount={10} />
        )}
      </div>
    </PageContainer>
  )
}

export default CustomersPage