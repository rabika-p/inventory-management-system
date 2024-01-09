import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUsername } from "../features/UsernameSlice";

interface IData {
  username: string;
  password: string;
}

interface ISigninProps {
  setShowUsername: (value: boolean) => void;
}

const Signin = ({setShowUsername} : ISigninProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IData>();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<IData> = (data) => {
    axios
      .post("http://localhost:8080/user/login", data)
      .then((res) => {
        if (res.data.err) {
          const errorMessage = res.data.err.message || "An error occurred";
          toast.error(errorMessage);
        } 
        else {
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          //get data from the backend
          const accessToken = res.data.accessToken;
          const role = res.data.role;
          const userId = res.data.userId;
          const username = res.data.username;

          dispatch(setUsername(res.data.username));

          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId);
            localStorage.setItem("username", username);
            
            //check if it is admin login or user login
            console.log(res.data);
            if (res.data.role === "ADMIN") {
              setTimeout(() => {
                navigate("/home");
              }, 1000);
              setTimeout(() => {
                setShowUsername(true); 
              }, 2000);
            } 
            else {
              setTimeout(() => {
                navigate("/request-products");
              }, 1000);
              setTimeout(() => {
                setShowUsername(true); 
              }, 2000);
            }
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <div className="text-center mt-10">
        <ToastContainer />
      </div>

      <div className="w-full flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-3/5 bg-white shadow-xl overflow-hidden"
        >
          <div className="w-2/3 p-10">
            <h1 className="text-3xl font-sans font-bold mb-7">
              SIGN <span className="text-[#2a7d80d4]">IN </span>
            </h1>

            <div className="mb-4 w-10/12">
              <label className="text-lg">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                {...register("username", {
                  required: "The username field is required",
                  maxLength: {
                    value: 20,
                    message: "Username cannot be longer than 20 characters",
                  },
                  minLength: {
                    value: 5,
                    message: "Username must be at least 5 characters",
                  },
                })}
                className={`border mr-5 rounded w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow appearance-none ${
                  errors.username ? "border-red-500" : ""
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-base">
                  {`${errors.username.message}`}
                </p>
              )}
            </div>

            <div className="mb-4 w-10/12">
              <label className="text-lg">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "The password field is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                autoComplete="current-password"
                className={`border rounded w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow appearance-none ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-base">
                  {`${errors.password.message}`}
                </p>
              )}
            </div>

            <div className="flex mt-7">
              <input
                type="submit"
                value={"Sign in"}
                className="w-10/12 bg-[#2a7d80d4] hover:bg-[#1f6365d4] hover:cursor-pointer
                 text-white font-semibold py-2 px-4 rounded"
              />
            </div>

            <div className="flex mt-7">
              <a href="/forgot-password">
              <h4 className="hover:underline">
                  Forgot your password?
                </h4>
              </a>
            </div>

            <div className="flex mt-7">
              <a href="/signup">
              
                <h4>
                  Don't have an account yet?&nbsp;
                  <span className="text-[#16989d] hover:underline">
                    Sign up
                  </span>
                </h4>
              </a>
            </div>

          </div>

          <div className="w-1/3 relative">
            <img
              src="../src/assets/images/login-img.jpg"
              alt="Image of an office room"
              className="w-full h-full object-cover rounded-r-lg"
            />
            <div className="absolute rounded-r-lg"></div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signin;
