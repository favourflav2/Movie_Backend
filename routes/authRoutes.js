import {Router} from "express"
import {  get_Saved_Movies, google_Sign_In, like_Movie, log_In, sign_Up } from "../controller/authController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
const router = Router()

router.post("/signup",sign_Up)
router.post("/login",log_In)
router.post("/google",google_Sign_In)

router.put("/like",authMiddleware,like_Movie)

router.get("/getLike",authMiddleware,get_Saved_Movies)


export default router