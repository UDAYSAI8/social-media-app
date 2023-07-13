import "./HomePage.css"
import PostOfUser from "../../Components/PostOfUser/PostOfUser.jsx"

function HomePage() {

  return (
    <div className="HomePage">
      <div className="HomePage-child" id="left"></div>
      <div className="HomePage-child" id="mid">
        <PostOfUser className="Post" />
        <PostOfUser className="Post" />
        <PostOfUser className="Post" />
        <PostOfUser className="Post" />
      </div>
    </div>
  )
}

export default HomePage;
