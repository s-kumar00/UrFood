import React, { useState } from "react";
import signlogin from "../assets/login-animation.gif";
import { Link, useNavigate } from "react-router-dom";
import { ImagetoBase64} from "../utility/ImagetoBase64";
import { toast } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadProfileImage = async(e)=>{
    const data = await ImagetoBase64(e.target.files[0])
    setData((preve)=>{
        return{
          ...preve,
          image : data
        }
    })
}
  const handleSubmit = async(e) => {

    e.preventDefault();

    const { firstName, email, password, confirmPassword } = data;
    if (firstName && email && password && confirmPassword) {
      if (password === confirmPassword) {
    
          const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/signup`,{
            method : "POST",
            headers : {
              "content-type" : "application/json"
            },
            body : JSON.stringify(data)
          })

          const dataRes = await fetchData.json()

        toast(dataRes.message)
        if(dataRes.alert){
          navigate("/login");
        }
       
      } else {
        alert("password and confirm password not equal");
      }
    } else {
      alert("Please Enter required fields");
    }
  };


  return (
    <div className="p-3 md:p-4 mt-5">
      <div className="w-full max-w-sm bg-white m-auto flex items-center flex-col p-4 rounded-xl">
        <div className="w-20 h-20 overflow-hidden rounded-full drop-shadow-md shadow-md relative">
          <img src={data.image ? data.image :  signlogin} className="w-full h-full" alt=""/>

          <label htmlFor="profileImage">
            <div className="cursor-pointer absolute bottom-0 h-1/3 bg-slate-500 bg-opacity-50 w-full text-center rounded-xl">
              <p className="text-sm p- 1 text-white text-opacity-70">upload</p>
            </div>
          </label>
          <input type={"file"} id="profileImage" accept="image/*" className="hidden" onChange={handleUploadProfileImage}/>
        </div>

        <form className="w-full py-3" onSubmit={handleSubmit}>
          <label
            htmlFor="firstName"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            First Name
          </label>
          <input
            type={"text"}
            id="firstName"
            name="firstName"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="First Name"
            required=""
            value={data.firstName}
            onChange={handleOnChange}
          ></input>

          <label
            htmlFor="lastName"
            className="block mt-2 mb-1 text-sm font-medium text-gray-900"
          >
            Last Name
          </label>
          <input
            type={"text"}
            id="lastName"
            name="lastName"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="Last Name"
            required=""
            value={data.lastName}
            onChange={handleOnChange}
          ></input>

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

          <label
            htmlFor="confirmpassword"
            className="block mt-2 mb-1 text-sm font-medium text-gray-900"
          >
            Confirm password
          </label>
          <div>
            <input
              type="confirmpassword"
              id="confirmpassword"
              name="confirmPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="••••••••"
              required=""
              value={data.confirmPassword}
              onChange={handleOnChange}
            ></input>
          </div>

          <div className="flex items-start">
            <div className="flex mt-2 items-center h-5">
              <input
                id="terms"
                aria-describedby="terms"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                required=""
              ></input>
            </div>
            <div className="ml-3 mt-2 text-sm">
              <label htmlFor="terms" className="font-light text-gray-500">
                I accept the{" "}
                <Link
                  className="font-medium text-blue-400 hover:underline"
                  to={"/#"}
                >
                  Terms and Conditions
                </Link>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-2 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Create an account
          </button>
        </form>

        <p className="mt-2 text-sm font-light text-gray-500 dark:text-gray-400 ">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="font-medium text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
