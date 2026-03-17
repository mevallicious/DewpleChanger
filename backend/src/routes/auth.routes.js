import {Router} from "express"
const authRouter = Router()
import {loginUser,registerUser,getMe,logoutUser} from "../controllers/auth.controller.js"
import { identifyUser } from "../middlewares/auth.middleware.js"

/**
 * @route Post 
 * @description to register a user
 * @access private
 */
authRouter.post("/register",registerUser)

/**
 * @route Post 
 * @description to login a user
 * @access private
 */
authRouter.post("/login",loginUser)

/**
 * @route Get
 * @description to fetch user's data
 * @access protected
 */
authRouter.get("/get-me",identifyUser,getMe)


/**
 * @route Post
 * @description to logout user
 * @access protected
 */
authRouter.post("/logout",logoutUser)

export default authRouter