import mongoose from "mongoose";
import { BookingType, HotelType } from "../shared/types";

const bookingSchema = new mongoose.Schema<BookingType>({
    userId: {type:String, requierd: true},
    email: {type:String, requierd: true},
    firstName: {type:String, requierd: true},
    lastName: {type:String, requierd: true}, 
    adultCount: {type:Number, required: true},
    childCount: {type:Number, required: true},
    totalCost: {type:Number, required: true},
    checkIn: {type: Date, required: true}, 
    checkOut: {type: Date, required: true},
})

const hotelSchema = new mongoose.Schema<HotelType>({
    userId: {type:String,required: true},
    name: {type:String,required: true},
    city: {type:String,required: true},
    county: {type:String,required: true},
    description: {type:String,required: true},
    type: {type:String,required: true},
    adultCount: {type: Number, required: true},
    childCount: {type: Number, required: true},
    facilities: [{type: String,required: true}],
    pricePerNight: {type: Number, required: true},
    starRating: {type: Number, required: true, min:1, max:5},
    imageUrls: [{type:String,required: true}],
    lastUpdated: {type: Date, required: true},
    bookings: [bookingSchema],
})

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema)
export default Hotel;