import UserModel  from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'



export const getAllUser = async(req, res) =>{
    try {
        const user = await UserModel.find();
       
        let users = user.map((user) => {
            
            const {password, ...otherDetails} = user._doc
            
            return otherDetails
        })
        
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }

}

export const getUser = async(req, res) =>{
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);
        
        if (user) {
            const { password, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails);
        } else {
            res.status(404).json({ msg: "User not found" });
        }
        
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}


export const updateUser = async (req, res) => {
    const _id = req.params.id;
    console.log("param =>", _id)
    const { id, currectAdmin, password } = req.body; 
    console.log("body =>", req.body)
    // let bool ;

//    if(currectAdmin === "true"){
//    bool = currectAdmin.toLowerCase() === 'true';
//    }
//    else{
//     bool= currectAdmin.toLowerCase() !== 'false';
//    }
    if (id === _id)  {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
            const token = jwt.sign(
                {username:user.username, id:user._id},
                process.env.JWT_KEY,{expiresIn:"2hr"}
            )
            res.status(200).json({user,token})

            // if (user) {
            //     const { password, ...otherDetails } = user._doc; 
            //     res.status(200).json(otherDetails);
            // } else {
            //     res.status(404).json({ msg: "User not found" });
            // }

        } catch (error) {
            res.status(500).json({ msg: "An error occurred while updating the user" });
        }
    } else {
        res.status(403).json({ msg: "Unauthorized to update this user" });
    }
};

export const deletUser = async (req, res) =>{
    const id = req.params.id
    const { currentUserId, currectAdmin } = req.body; 

    console.log(typeof(currectAdmin))

    let bool ;
    if(currectAdmin === "true"){
        bool = currectAdmin.toLowerCase() === 'true';
        }
        else{bool=
          currectAdmin.toLowerCase() !== 'false';
        }
    
     if ((id === currentUserId) || bool ) {

        try {

            await UserModel.findByIdAndDelete(id)
            res.status(200).json("user deleted successfully")
            
        } catch (error) {
            res.status(500).json({ msg:error });
        }
     }

}


export const followUser = async(req, res) =>{
    const id = req.params.id;
    const {currentUserId} =req.body;
   
    if(id === currentUserId){
        res.status(403).json("action forbidden")
    }else{
    
        try {
            const followUser = await UserModel.findById(id);
            const followingUser =await UserModel.findById(currentUserId);
           
            if(!followUser.followers.includes(currentUserId))    
            {
                await followUser.updateOne({$push:{followers:currentUserId}})
                await followingUser.updateOne({$push:{following:id}})
                res.status(200).json("User followed");
            }
            else{
                res.status(403).json("User is already followed by you");
            }

        } catch (error) {
            res.status(500).json({ msg:error });
        }
    }
}

export const UnfollowUser = async(req, res) =>{
    const id = req.params.id;
    const {currentUserId} =req.body;
   
    if(id === currentUserId){
        res.status(403).json("action forbidden")
    }else{
    
        try {
            const followUser = await UserModel.findById(id);
            const followingUser =await UserModel.findById(currentUserId);
           
            if(followUser.followers.includes(currentUserId))    
            {
                await followUser.updateOne({$pull:{followers:currentUserId}})
                await followingUser.updateOne({$pull:{following:id}})
                res.status(200).json("User unfollowed");
            }
            else{
                res.status(403).json("User is not followed by you");
            }

        } catch (error) {
            res.status(500).json({ msg:error });
        }
    }
}