//Craete a model for posts in social media app in mongoose
// Path: backend\models\PostModel.js
import {Schema,model} from "mongoose";
const postSchema = new Schema({
    user:{
        type:String,
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    likes:[{
        type:String,
    }],
    comments:[{
        type:String,
    }]
},{timestamps:true});
const Post = model("Post",postSchema);
export default Post;