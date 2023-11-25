const {StatusCodes} = require('http-status-codes');

const {BookingService} = require('../services/index');

const {createChannel,publishMessage} = require('../utils/messageQueue');
const {REMINDER_BINDING_KEY} = require('../config/serverConfig')

const bookingService = new BookingService();

class BookingController{

    constructor(channel){
    }

    async sendMessageToQueue(req,res){
        const channel = await createChannel();
        const data = {message:'SUCCESS'};
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(data));
        return res.status(200).json({
            message:"Successfully published the event"
        })
    }

    async create (req,res){
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message:'Successfully completed the booking',
                success: true,
                err:{},
                data:response
            })
        } catch (error) {
            return res.status(error.statucCode).json({
                message:error.message,
                success:false,
                err: error.explanation,
                data:{}
            })
        }
    }
}

module.exports=BookingController;