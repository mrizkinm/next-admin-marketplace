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

const ProductsPage = () => {
  const [ data, setData] = useState([])
  const totalItems = data.length;

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("/api/data/products", { method: "GET" });
  
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error('Gagal mendapatkan akses token baru:', error.message);
        throw error;
      }
    };
    getData()
  }, [])

  return (
    <div className="h-full p-4 md:px-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Products"
            description="List of products"
          />
          <Link
            href="/dashboard/products/add"
            className={cn(buttonVariants())}
            title="Add Product"
          >
            <Plus className="h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <DataTable data={data} columns={columns} totalItems={totalItems} searchKey="name" />
      </div>
    </div>
  )
}

export default ProductsPage