import React, { useState } from "react";
import signlogin from "../assets/login-animation.gif";
import {Link} from "react-router-dom"
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginRedux } from "../redux/userSlice";

const Login = () => {
  const [data, setData] = useState({
    email : "",
    password : "",
  })

  const navigate = useNavigate()  
  
  const userData = useSelector(state => state)


  const dispatch = useDispatch()

  const handleOnChange = (e) =>{
    const {name, value} = e.target
    setData((preve) => {
      return {
        ...preve,
        [name] : value
      }
    })
  }

  const handleSubmit = async(e) =>{

    e.preventDefault()
    const {email,password} = data
    if(email && password ){
      const fetchData = await fetch(`http://localhost:8000/login`,{
        method : "POST",
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify(data)
      })

      const dataRes = await fetchData.json()
      
      toast(dataRes.message)
      
      if(dataRes.alert){
        navigate("/")
        dispatch(loginRedux(dataRes))
        setTimeout(() => {
          navigate("/")
        }, 1000);
      }

      console.log(userData)
    }
    else{
        alert("Please Enter required fields")
    }
  }

  return (
    <div className="p-3 md:p-4 mt-5">
      <div className="w-full max-w-sm bg-white m-auto flex items-center flex-col p-4 rounded-xl">
        <div className="w-20 overflow-hidden rounded-full drop-shadow-md shadow-md">
          <img src={signlogin} className="w-full" alt=""/>
        </div>

        <form className="w-full py-3" onSubmit={handleSubmit}>
          
          <label
            htmlFor="email"
            className="block mt-2 mb-1 text-sm font-medium text-gray-900"
          >
            Your email
          </label>
          <input
            type={"email"}
            id="email"
            name="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="name@gmail.com"
            required=""
            value={data.email}
            onChange={handleOnChange}
          ></input>

          <label
            htmlFor="password"
            className="block mt-2 mb-1 text-sm font-medium text-gray-900 "
          >
            password
          </label>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="••••••••"
              required=""
              value={data.password}
              onChange={handleOnChange}
            ></input>
          </div>

          <button
            type="submit"
            className="w-full mt-2 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Login
          </button>
        </form>
      
          <p className="mt-2 text-sm font-light text-gray-500 dark:text-gray-400 ">
            Don't an account?{" "}
            <Link to ="/signup" className="font-medium text-blue-400 hover:underline">
              SignUp
            </Link>
          </p>
      </div>
    </div>
  );
}

export default Login
