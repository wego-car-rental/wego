import { type NextRequest, NextResponse } from "next/server"
import { db, auth } from "@/lib/firebase-admin"
import type { User } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const decodedToken = await auth.verifyIdToken(token)
    const userDoc = await db.collection("users").doc(decodedToken.uid).get()
    const user = userDoc.data() as User

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get statistics
    const bookingsSnapshot = await db.collection("bookings").get()
    const vehiclesSnapshot = await db.collection("vehicles").get()
    const activeVehiclesSnapshot = await db.collection("vehicles").where("available", "==", true).get()
    const driversSnapshot = await db.collection("drivers").where("available", "==", true).get()

    const totalRevenue = bookingsSnapshot.docs
      .filter((doc) => doc.data().paymentStatus === "paid")
      .reduce((sum, doc) => sum + (doc.data().totalPrice || 0), 0)

    // Calculate trends for last 7 days
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recentBookings = bookingsSnapshot.docs.filter(doc => {
      const createdAt = doc.data().createdAt?.toDate()
      return createdAt && createdAt >= sevenDaysAgo
    })

    const bookingsTrend = []
    const revenueTrend = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]

      const dayBookings = recentBookings.filter(doc => {
        const createdAt = doc.data().createdAt?.toDate()
        return createdAt && createdAt.toISOString().split('T')[0] === dateStr
      })

      const dayRevenue = dayBookings
        .filter(doc => doc.data().paymentStatus === "paid")
        .reduce((sum, doc) => sum + (doc.data().totalPrice || 0), 0)

      bookingsTrend.push({ date: dateStr, count: dayBookings.length })
      revenueTrend.push({ date: dateStr, amount: dayRevenue })
    }

    return NextResponse.json({
      totalBookings: bookingsSnapshot.size,
      totalRevenue,
      totalVehicles: vehiclesSnapshot.size,
      activeVehicles: activeVehiclesSnapshot.size,
      activeDrivers: driversSnapshot.size,
      bookingsTrend,
      revenueTrend,
    })
  } catch (error) {
    console.error("[v0] Dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
