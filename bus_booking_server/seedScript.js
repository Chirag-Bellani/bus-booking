import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { buses, generateSeats, locations } from './seedData.js'
import Bus from './models/bus.js'

dotenv.config()

// ✅ Generate random departure/arrival time
const generateRandomTime = (baseDate) => {
  const hour = Math.floor(Math.random() * 12) + 6 // 6 AM to 6 PM
  const minute = Math.random() > 0.5 ? 30 : 0
  const dateTime = new Date(baseDate)
  dateTime.setHours(hour, minute, 0, 0)
  return dateTime
}

async function seedDatabase() {
  try {
    // ✅ Connect to DB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // ✅ Clear old buses
    await Bus.deleteMany()
    console.log('🧹 Old bus data deleted')

    const busesToInsert = []
    const baseDate = new Date()

    // ✅ Generate data for all route combinations for 7 days
    for (let i = 0; i < locations.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        const from = locations[i]
        const to = locations[j]
        if (from === to) continue // skip same source-destination

        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const travelDate = new Date(baseDate)
          travelDate.setDate(baseDate.getDate() + dayOffset)

          // each bus type in buses array
          buses.forEach((bus) => {
            const departureTime = generateRandomTime(travelDate)
            const arrivalTime = new Date(departureTime)
            arrivalTime.setHours(arrivalTime.getHours() + 9, arrivalTime.getMinutes() + 30) // 9h 30m later

            // 🚌 Outbound bus
            busesToInsert.push({
              busId: `${bus.busId}_${from}_${to}_${dayOffset}`,
              from,
              to,
              departureTime,
              arrivalTime,
              duration: '9h 30m',
              availableSeats: 28,
              price: bus.price,
              originalPrice: bus.originalPrice,
              company: bus.company,
              busType: bus.busType,
              rating: bus.rating,
              totalReviews: bus.totalReviews,
              badges: bus.badges,
              seats: generateSeats(),
            })

            // 🔁 Return bus (next day)
            const returnDepartureTime = generateRandomTime(new Date(travelDate))
            const returnArrivalTime = new Date(returnDepartureTime)
            returnArrivalTime.setHours(returnArrivalTime.getHours() + 9, returnArrivalTime.getMinutes() + 30)

            busesToInsert.push({
              busId: `${bus.busId}_${to}_${from}_${dayOffset}_return`,
              from: to,
              to: from,
              departureTime: returnDepartureTime,
              arrivalTime: returnArrivalTime,
              duration: '9h 30m',
              availableSeats: 28,
              price: bus.price,
              originalPrice: bus.originalPrice,
              company: bus.company,
              busType: bus.busType,
              rating: bus.rating,
              totalReviews: bus.totalReviews,
              badges: bus.badges,
              seats: generateSeats(),
            })
          })
        }
      }
    }

    // ✅ Insert all buses
    await Bus.insertMany(busesToInsert)
    console.log(`✅ Database seeded successfully with ${busesToInsert.length} buses.`)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await mongoose.connection.close()
    console.log('🔒 Connection closed')
  }
}

seedDatabase()
