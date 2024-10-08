import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";

export const createPost = async(req, res) => {
    const newPost = new PostModel(req.body)

    try {
        await newPost.save()
        console.log("post")
        res.status(200).json(newPost)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getPost = async(req, res) =>{
    const id = req.params.id;
    try {
        const post = await PostModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updatePost = async(req, res)=>{
    const postId = req.params.id;
    const {userId} = req.body;

    try {
        const post = await PostModel.findById(postId)
        
        if(post.userId === userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("Post Updated")
            
        }else{
            res.status(403).json("Action Forbodden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deletePost = async(req, res) => {
    const id = req.params.id;
    const {userId} = req.body;
    try {
        const post = await PostModel.findById(id)
        
        if(post.userId === userId){
            await post.deleteOne()
            res.status(200).json("Post deleted")
            
        }else{
            res.status(403).json("Action Forbodden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export const likePost = async(req, res)=>{
    const id = req.params.id;
    const {userId} = req.body;
    try {
        const post = await PostModel.findById(id)
        if(!post.likes.includes(userId)){
            await post.updateOne({$push:{likes:userId}})
            res.status(200).json("Post Liked")
        } else{
            await post.updateOne({$pull:{likes:userId}})
            res.status(200).json("Post unLiked")
        }   
      
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getTimeLinePost = async (req, res) => {
    const userId = req.params.id;

    try {
        // Fetch posts by the current user
        const currentUserPosts = await PostModel.find({ userId: userId });

        // Fetch posts from users that the current user is following
        const followingPostsData = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'posts', // Ensure this matches the actual collection name
                    localField: 'following',
                    foreignField: 'userId',
                    as: 'followingPosts'
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ]);

        const followingPosts = followingPostsData.length > 0 ? followingPostsData[0].followingPosts : [];

        const allPosts = currentUserPosts.concat(...followingPosts).sort((a,b)=>{
            return b.createdAt - a.createdAt;
        });

        res.status(200).json(allPosts);
    } catch (error) {
        console.error('Error fetching timeline posts:', error);
        res.status(500).json({ error: 'An error occurred while fetching timeline posts' });
    }
};
