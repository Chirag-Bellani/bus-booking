import express from "express"
import {bookTicket,getUserTickets} from '../controllers/ticket.js';
import {verifyToken} from '../middleware/verfiy.js'

const router=express.Router(
)
router.post('/book',verifyToken,bookTicket)
router.post('/my-ticket',verifyToken,getUserTickets)

export default router;