import "./PostOfUser.css"
import React,{useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import {Card, CardImg, CardBody,CardTitle, CardText, Button,CardHeader,CardFooter} from "reactstrap"
import axiosInstance from "../../axios";
  
function PostOfUser() {
    const [isActive, setActive] = useState(null);
    const token = localStorage.getItem("token");
    axiosInstance().get("http://localhost:3000/posts/64af8169ff8b8652af20c454/likes",).then((res)=>{
        const arr = res.data.data.likes;
        if(arr.includes(res.data.data.user)){
            setActive(true);
        }
        else{
            setActive(false);
        }
    })
    console.log(isActive);
    
    function likeButton(){
        // setActive(!isActive);
        if(isActive){
            axiosInstance().patch("http://localhost:3000/posts/64af8169ff8b8652af20c454/dislike").then((res)=>{
                console.log("disliked");
            })
            setActive(false);
        }
        else{
            axiosInstance().patch("http://localhost:3000/posts/64af8169ff8b8652af20c454/like").then((res)=>{
                console.log("liked");
            })
            setActive(true);
        }
    }

    return (
        <div style={{display: 'block', width: 700, padding: 30}}>
            <Card className=""style={{width: '100%'}}>
                <CardHeader>
                    <div className="prof-container">
                        <img className='prof_img' src='https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg' />
                        <p className="prof_name">Vijay_123</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <CardTitle tag="h5">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos, alias!
                    </CardTitle>
                    <CardImg src='https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg' />
                </CardBody>
                <CardFooter>
                    <button className={isActive ? "btn btn-block" : "btn btn-block btn-primary"} onClick={likeButton}><i className="fa fa-thumbs-up"></i> </button>
                    123 Likes
                    <input type="text" placeholder="Add a comment" className="comment" />
                     
                </CardFooter>
            </Card>
        </div>
    );
}
  
export default PostOfUser;