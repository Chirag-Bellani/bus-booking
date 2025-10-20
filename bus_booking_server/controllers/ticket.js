import Bus from '../models/bus.js'
import User from '../models/user.js'
import Ticket from '../models/ticket.js'
import {v4 as uuidv4} from 'uuid'

export const getUserTickets=async(req,res)=>{
    try{
            const userId=req.userId
            const tickets=await Ticket.find({user:userId})
            .populate(
                "bus",
                "busId from to busType company departureTime arrivalTime price"
            ).sort({bookedAt:-1})
            
            res.status(200).json({success:true,tickets:tickets || {}})
    }
    catch(error){
        console.error('Error fetching tickets',error)
        res.status(500).json({error:'Internal Server Error'});

    }
}

export const bookTicket=async(req,res)=>{
    try {
        const{busId,date,seatNumbers}=req.body;
        const userId=req.userId

        if(!busId || !date || !seatNumbers || seatNumbers.length===0){
            return res.status(400).json({error:'All fields are required'})
        }
        const bus=await Bus.findOne({busId})
        if(!bus){
            return res.status(404).jsons({error:'User not found'});
        }
        const unavailableSeats=seatNumbers.filter((seatNum)=>bus.seats?.some((row)=>row?.some((seat)=>seat.seat_id)===seatNum && seat.booked))
        const totalFare=bus.price* seatNumbers*length
        const newTicket=new Ticket({
            user:userId,
            bus:bus.id,
            date,
            seatNumbers,
            total_fare:totalFare,
            pnr:uuidv4().slice(0,10).toUpperCase(),
        });
        bus.seats.forEach((row)=>{
            row?.forEach((seat)=>{
                if(seatNumbers.includes(seat.seat_id)){
                    seat.booked=true
                }
            })
        })
        await bus.save();
        res.status(201).json({
            success:true,
            message:"Ticket booked successfully",
            ticket:newTicket
        })
    } catch (error) {
        console.error('Error booking tickets:',error)
        res.status
    }
}

