import Heading from '@/components/heading';
import PageContainer from '@/components/page-container';
import db from '@/lib/db';
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';

const DetailPage = async ({params}) => {
  const { orderId } = await params;

  const order = await db.order.findUnique({
    where: {
      id: parseInt(orderId)
    },
    include: {
      items: {
        include: {
          product: true // Ini akan menyertakan informasi produk
        }
      },
      customer: true,
    }
  })

  const isGuest = !!order.guestInfo;
  const customerName = isGuest ? order.guestInfo.name : order.customer.name;
  const customerEmail = isGuest ? order.guestInfo.email : order.customer.email;
  const customerPhone = isGuest ? order.guestInfo.phone : order.customer.phone;
  const customerAddress = isGuest ? order.guestInfo.address : order.customer.address;

  const statusColors = {
    Pending: 'bg-yellow-500 text-white hover:bg-yellow-600',
    Processed: 'bg-green-500 text-white hover:bg-green-600',
    Canceled: 'bg-red-500 text-white hover:bg-red-600',
  };

  const badgeClass = statusColors[order.status] || "bg-gray-500 text-white";

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Detail Order"
            description="Detail of order"
          />
        </div>
        <Separator />
        {/* Order Info */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Information about the order</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold">Order ID</p>
                <p className="text-sm">{order.id}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Order Status</p>
                <Badge className={badgeClass}>{order.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-semibold">Total Amount</p>
                <p className="text-sm">Rp {order.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Order Date</p>
                <p className="text-sm">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>{isGuest ? "Guest" : "Customer"} Details</CardTitle>
            <CardDescription>Information about the {isGuest ? "guest" : "customer"}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold">Name</p>
                <p className="text-sm">{customerName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Email</p>
                <p className="text-sm">{customerEmail}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Phone</p>
                <p className="text-sm">{customerPhone}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Address</p>
                <p className="text-sm">{customerAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>List of items in the order</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>Rp {item.price.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

export default DetailPage