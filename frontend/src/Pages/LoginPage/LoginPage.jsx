import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
const addUser = (e) => {
    e.preventDefault();
    const requestBody = {
      username,
      password,
    };
    axios.post("http://localhost:3000/login", requestBody).then((res) => {
        setUsername("");
        setPassword("");

        toast.success(res.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

        const token = res.data.token;
        localStorage.setItem("token", token);

        navigate("/");
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });

      
  };

  return (
    <>
      <form onSubmit={addUser}>
        <div>
          <label htmlFor="">Username:</label>
          <input type="text" name="username" id="username"
            onChange={(e) => {
              console.log(e.target.value);
              setUsername(e.target.value);
            }}
            value={username}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password"
            onChange={(e) => {
                console.log(e.target.value);
              setPassword(e.target.value);
            }}
            value={password}
          />
        </div>
        
        <button type="submit">Submit</button>
      </form>

      <ToastContainer />
    </>
  );
};

export default Login;
