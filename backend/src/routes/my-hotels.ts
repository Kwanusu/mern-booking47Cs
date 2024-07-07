import express, { Request, Response} from 'express';
import multer from 'multer'
import cloudinary from 'cloudinary'
import { HotelType } from '../models/hotels';
import Hotel from '../models/hotels';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 // 5MB
    }
})
// api/my-hotels
router.post(
    "/",
    verifyToken, [
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("county").notEmpty().withMessage("County is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("type").notEmpty().withMessage("Hotel type is required"),
        body("pricePerNight")
            .notEmpty()
            .isNumeric()
            .withMessage("Price per night is required and must be a number"),
        body("facilities").notEmpty().isArray().withMessage("Facilities are required"),
    ],
    upload.array("imageFiles", 6), 
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];  
            const newHotel: HotelType = req.body;
            // Upload images to cloudinary
            const uploadPromises = imageFiles.map(async(image) => {
                const b64 = Buffer.from(image.buffer).toString("base64");
                let dataURI = "data:" + image.mimetype + ";base64" + b64;
                const res = await cloudinary.v2.uploader.upload(dataURI);
                return res.url;
            }); 

            const imageUrls = await Promise.all(uploadPromises);
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            //save hotel in the database
            const hotel = new Hotel(newHotel);
            await hotel.save();

            //return a 201 status response
            res.status(201).send(hotel);

        } catch (error) {
          console.log("Error occured",error);
          res.status(500).json({message: "Something went wrong"}); 
        }
}); 

export default router;