import express,{json} from "express";
import mongoose from "mongoose";
import User from "./models/UserModel.js";
import Post from "./models/PostModel.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 3000;


app.listen(PORT, () => {
    console.log("Listening on PORT:" + PORT);
});

app.use(cors());
app.use(json());
//Connect to mongodb
mongoose.connect(process.env.DATABASE_URL).then(() => {console.log("Database connected successfully");});

app.get("/",(req,res)=>{
    res.send("Hello World");
}  
);

const generateToken = (user_id) => {
    const token = jwt.sign({user_id,}, process.env.SECRET_KEY, { expiresIn: "1d" });
    return token;
};

const checkToken = (req, res, next) => {
    let token = req.headers.authorization;
    // token present or not
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }
    // check validity of the token
    try {
      token = token.split(" ")[1];
  
      let decodedToken = jwt.verify(token, "secret");
  
      req.user_id = decodedToken.user_id;
      console.log(decodedToken);
  
      next();
    } catch {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }
};

//Create a new user
app.post("/register", (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
  
    if (!name || !username || !password) {
      return res.status(400).json({
        message: "Please fill all fields!",
      });
    }
  
    User.findOne({username: username,}).then((data, err) => {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
  
      if (data) {
        return res.status(409).json({
          message: "Username already used",
        });
      } else {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedPassword = bcrypt.hashSync(password, salt);
  
        User.create({
          name: name,
          username: username,
          password: encryptedPassword,
        }).then((data, err) => {
          if (err) {
            return res.status(500).json({
              message: "Internal Server Error",
            });
          }
  
          return res.status(201).json({
            message: "User registered successfully!",
            user: data,
            token: generateToken(data._id),
          });
        });
      }
    });
  });

  //Login a user
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Please fill all fields!",
        });
    }
    User.findOne({
        username: username,
      }).then((data, err) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
    
        if (data) {
          const isMatch = bcrypt.compareSync(password, data.password);
    
          if (isMatch) {
            return res.status(200).json({
              message: "User validated successfully!",
              user: data,
              token: generateToken(data._id),
            });
          } else {
            return res.status(401).json({
              message: "Invalid Credentials",
            });
          }
        } else {
          return res.status(404).json({
            message: "User not found!",
          });
        }
    });
});


//Create a new post
app.post("/create-post",checkToken,(req,res)=>{
    const content = req.body.content;
    const image = req.body.image;
    const user_id = req.user_id;
    Post.create({user:user_id
        ,content,image}).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while creating post",
                error:err
            })
        }
        if(!content){
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
app.get("/posts",checkToken,(req,res)=>{
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
app.get("/get-posts",checkToken,(req,res)=>{
    const user_id = req.user_id;
    Post.find({user:user_id}).then((data,err)=>{
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
app.patch("/posts/:id/like",checkToken,(req,res)=>{
    const id = req.params.id;
    const user = req.user_id;
    Post.findByIdAndUpdate(id,{$push:{likes:user}},{new:true}).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while liking post",
                error:err
            })
        }
        return res.status(200).json({
            message:"Liked Successfully",
            data:data
        });
    })
});

//dislike a post
app.patch("/posts/:id/dislike",checkToken,(req,res)=>{
    const id = req.params.id;
    const user = req.user_id;
    Post.findByIdAndUpdate(id,{$pull:{likes:user}},{new:true}).then((data,err)=>{
        if(err){
            return res.status(500).json({
                message:"Error occured while disliking post",
                error:err
            })
        }
        return res.status(200).json({
            message:"Disliked Successfully",
            data:data
        });
    })
}
);

//Comment on a post
app.patch("/posts/:id/comment",checkToken,(req,res)=>{
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
app.delete("/posts/:id",checkToken,(req,res)=>{
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
app.delete("/delete-users",checkToken,(req,res)=>{
    const id = req.user_id;
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
app.get("/posts/:id/comments",checkToken,(req,res)=>{
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
app.get("/posts/:id/likes",checkToken,(req,res)=>{
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
            data:data,
        });
    })
}
);

//Get a particular user
app.get("/users/:id",checkToken,(req,res)=>{
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
app.get("/posts/:id",checkToken,(req,res)=>{
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
app.get("/users/:id/posts",checkToken,(req,res)=>{
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



