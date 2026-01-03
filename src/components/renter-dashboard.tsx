"use client"

import type { Booking, Car, User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "./ui/button"
import { format } from "date-fns"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RenterDashboard({
  renter,
  bookings,
  cars,
  loading,
}: {
  renter: User
  bookings: Booking[] | null
  cars: Car[] | null
  loading: boolean
}) {
  const renterBookings = bookings?.filter((b) => b.customerId === renter.id) || []

  const activeBookings = renterBookings.filter((b) => b.status === "approved")
  const completedBookings = renterBookings.filter((b) => b.status === "completed")
  const pendingBookings = renterBookings.filter((b) => b.status === "pending")
  const cancelledBookings = renterBookings.filter((b) => b.status === "cancelled")
  const upcomingBookings = activeBookings.filter((b) => new Date(b.startDate) > new Date())

  // Calculate total spent
  const totalSpent = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0)

  const getStatusVariant = (status: Booking["status"]) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "secondary"
      case "completed":
        return "outline"
      case "rejected":
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Renter Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {renter.displayName}! Manage your rentals and bookings.</p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-end space-x-4">
        <Button asChild>
          <Link href="/browse">Browse Cars</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/booking">New Booking</Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBookings.length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            <p className="text-xs text-muted-foreground">Starting soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBookings.length}</div>
            <p className="text-xs text-muted-foreground">Total completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelledBookings.length}</div>
            <p className="text-xs text-muted-foreground">Cancelled rentals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpent.toLocaleString()} RWF</div>
            <p className="text-xs text-muted-foreground">All time expenditure</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Rentals</TabsTrigger>
          <TabsTrigger value="pending">Pending Rentals</TabsTrigger>
          <TabsTrigger value="completed">Completed Rentals</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        {/* Active Rentals Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rental ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        {cars?.find((c) => c.id === booking.carId)?.brand}{" "}
                        {cars?.find((c) => c.id === booking.carId)?.model}
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                      </TableCell>
                      <TableCell>{booking.totalPrice.toLocaleString()} RWF</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/browse/${booking.carId}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {activeBookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No active rentals
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Rentals Tab */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rental ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        {cars?.find((c) => c.id === booking.carId)?.brand}{" "}
                        {cars?.find((c) => c.id === booking.carId)?.model}
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                      </TableCell>
                      <TableCell>{booking.totalPrice.toLocaleString()} RWF</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendingBookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No pending rentals
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Rentals Tab */}
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rental ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        {cars?.find((c) => c.id === booking.carId)?.brand}{" "}
                        {cars?.find((c) => c.id === booking.carId)?.model}
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                      </TableCell>
                      <TableCell>{booking.totalPrice.toLocaleString()} RWF</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/browse/${booking.carId}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {completedBookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No completed rentals
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cancelled Rentals Tab */}
        <TabsContent value="cancelled">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rental ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cancelledBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        {cars?.find((c) => c.id === booking.carId)?.brand}{" "}
                        {cars?.find((c) => c.id === booking.carId)?.model}
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d")}
                      </TableCell>
                      <TableCell className="text-sm">{booking.cancellationReason || "No reason provided"}</TableCell>
                      <TableCell>{booking.totalPrice.toLocaleString()} RWF</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/browse">Book Another</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {cancelledBookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No cancelled rentals
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
