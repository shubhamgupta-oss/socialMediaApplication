import express from "express";
import { getUser, updateUser, deletUser,followUser, UnfollowUser , getAllUser} from "../Controllers/UserContriller.js";


const router = express.Router();



router.get('/', getAllUser)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deletUser)
router.put('/:id/follow', followUser)
router.put('/:id/unfollow', UnfollowUser) 



export default router;