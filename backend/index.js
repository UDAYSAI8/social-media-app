import express from "express";
import mongoose from "mongoose";
import User from "./models/UserModel.js";
import Post from "./models/PostModel.js";
import cors from "cors";
import {json} from "express";

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log("Listening on PORT:" + PORT);
});

app.use(cors());
app.use(json());
//Connect to mongodb
mongoose.connect("mongodb+srv://budaysaireddy:Uday2286@cluster0.eajzt7u.mongodb.net/social")
.then(() => {console.log("Database connected successfully");});

app.get("/",(req,res)=>{
    res.send("Hello World");
}  
);

//Create a new user
app.post("/register",(req,res)=>{
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username:username}).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while creating user",
                error:err
            })}
        if(data){
            return res.status(400).json({
                message:"User already exists"
            })
        }else{
            User.create({name,username,password}).then((data,err)=>{
                if(err){
                    return res.status(500).json({
                        message:"Error occured while creating user",
                        error:err
                    })
                }
                if(!name || !username || !password){
                    return res.status(400).json({
                        message:"All fields are required"
                    })
                }
                return res.status(200).json({
                    message:"User created successfully",
                    data:data
                });
            })
        }
    });
});

//Create a new post
app.post("/create-post",(req,res)=>{
    const user = req.body.user;
    const content = req.body.content;
    const image = req.body.image;
    Post.create({user,content,image}).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while creating post",
                error:err
            })
        }
        if(!user || !content){
            return res.status(400).json({
                message:"All fields are required"
            })
        }
        return res.status(200).json({
            message:"Post created successfully",
            data:data
        });
    })
});

//Get all posts
app.get("/posts",(req,res)=>{
    Post.find({}).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while getting posts",
                error:err
            })
        }
        return res.status(200).json({
            message:"Posts retrieved successfully",
            data:data
        });
    })
}
);

//Get all posts of a particular user
app.get("/posts/:user",(req,res)=>{
    const user = req.params.user;
    Post.find({user:user}).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while getting posts",
                error:err
            })
        }
        return res.status(200).json({
            message:"Posts retrieved successfully",
            data:data
        });
    })
}
);

//Like a post
app.patch("/posts/:id/like",(req,res)=>{
    const id = req.params.id;
    Post.findByIdAndUpdate(id,{$inc:{likes:1}},{new:true}).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while liking post",
                error:err
            })
        }
        return res.status(200).json({
            message:"Post liked successfully",
            data:data
        });
    })
});

//Comment on a post
app.patch("/posts/:id/comment",(req,res)=>{
    const id = req.params.id;
    const Comment = req.body.comment;
    
    console.log(Comment,id);
    Post.findByIdAndUpdate(id,{$push:{comments:Comment}},{new:true}).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while commenting post",
                error:err
            })
        }
        return res.status(200).json({
            message:"Commented Successfully",
            data:data
        });
    })
});

//Delete a post
app.delete("/posts/:id",(req,res)=>{
    const id = req.params.id;
    Post.findByIdAndDelete(id).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while deleting post",
                error:err
            })
        }
        return res.status(200).json({
            message:"Post deleted successfully",
            data:data
        });
    })
}
);


//Delete a user
app.delete("/users/:id",(req,res)=>{
    const id = req.params.id;
    User.findByIdAndDelete(id).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while deleting user",
                error:err
            })
        }
        Post.deleteMany({user:id}).then((data,err)=>{
            if(err){
                return res.status(500).json({
                    message:"Error occured while deleting posts of user",
                    error:err
                })
            }
        })
        return res.status(200).json({
            message:"User deleted successfully",
            data:data
        });
    })
}
);

//Get all comments of a post
app.get("/posts/:id/comments",(req,res)=>{
    const id = req.params.id;
    Post.findById(id).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while getting comments",
                error:err
            })
        }
        return res.status(200).json({
            message:"Comments retrieved successfully",
            data:data.comments
        });
    })
}
);

//Get all likes of a post
app.get("/posts/:id/likes",(req,res)=>{
    const id = req.params.id;
    Post.findById(id).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while getting likes",
                error:err
            })
        }
        return res.status(200).json({
            message:"Likes retrieved successfully",
            data:data.likes
        });
    })
}
);

//Get a particular user
app.get("/users/:id",(req,res)=>{
    const id = req.params.id;
    User.findById(id).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while getting user",
                error:err
            })
        }
        return res.status(200).json({
            message:"User retrieved successfully",
            data:data
        });
    })
}
);

//Get a particular post
app.get("/posts/:id",(req,res)=>{
    const id = req.params.id;
    Post.findById(id).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while getting post",
                error:err
            })
        }
        return res.status(200).json({
            message:"Post retrieved successfully",
            data:data
        });
    })
}
);

//Get all posts of a particular user
app.get("/users/:id/posts",(req,res)=>{
    const id = req.params.id;
    Post.find({user:id}).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while getting posts",
                error:err
            })
        }
        return res.status(200).json({
            message:"Posts retrieved successfully",
            data:data
        });
    })
}
);



