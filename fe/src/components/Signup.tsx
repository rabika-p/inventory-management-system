import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";

interface IData {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  position: string;
  email: string;
}

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IData>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IData> = (data) => {
    axios
      .post("http://localhost:8080/user/signup", data)
      .then((res) => {
        console.log(res.data);
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
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <div className="text-center mt-10">
        <ToastContainer />
      </div>

      <div className="w-full flex justify-center mb-16">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-3/5 bg-white shadow-xl overflow-hidden"
        >
          <div className="w-2/3 p-10">
            <h1 className="text-3xl font-sans font-bold mb-7">
              SIGN <span className="text-[#16989d]">UP</span>
            </h1>

            <div className="flex gap-x-5 w-11/12">
              <div className="mb-4">
                <label className="text-lg">
                  Firstname <span className="text-red-500">*</span>
                </label>
                {/* register your input into the hook by invoking the "register" function */}
                <input
                  {...register("firstname", {
                    required: "The firstname field is required",
                    maxLength: {
                      value: 20,
                      message: "Name cannot be longer than 20 characters",
                    },
                    pattern: {
                      value: /^[A-Za-z]+$/i,
                      message:
                        "Name should only contain alphabetical characters",
                    },
                    // validate: (value) => {
                    //   if (value.trim() === ""){
                    //     return "Name should not only contain spaces"
                    //   }
                    // }
                  })}
                  className="border rounded w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow appearance-none"
                />
                {/* errors will return when field validation fails  */}
                {errors.firstname && (
                  <p className="text-red-500 text-base">{`${errors.firstname.message}`}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="text-lg">
                  {" "}
                  Lastname <span className="text-red-500">*</span>{" "}
                </label>
                <input
                  {...register("lastname", {
                    required: "The lastname field is required",
                    maxLength: {
                      value: 20,
                      message: "Name cannot be longer than 20 characters",
                    },
                    pattern: {
                      value: /^[A-Za-z]+$/i,
                      message:
                        "Name should only contain alphabetical characters",
                    },
                  })}
                  className="border rounded w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow appearance-none"
                />
                {errors.lastname && (
                  <p className="text-red-500 text-base">{`${errors.lastname.message}`}</p>
                )}
              </div>
            </div>

            <div className="mb-4 w-11/12">
              <label className="text-lg">
                {" "}
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email", {
                  required: "The email field is required",
                  pattern: {
                    value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="border rounded w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow appearance-none"
              />
              {errors.email && (
                <p className="text-red-500 text-base">{`${errors.email.message}`}</p>
              )}
            </div>

            <div className="flex gap-x-5 w-11/12">
              <div className="mb-4">
                <label className="text-lg">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("position", {
                    required: "The position field is required",
                    maxLength: {
                      value: 40,
                      message: "Position cannot be longer than 40 characters",
                    },
                    minLength: {
                      value: 5,
                      message: "Position must be at least 5 characters",
                    },
                  })}
                  className={`border mr-5 rounded w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow appearance-none ${
                    errors.position ? "border-red-500" : ""
                  }`}
                />
                {errors.position && (
                  <p className="text-red-500 text-base">
                    {`${errors.position.message}`}
                  </p>
                )}
              </div>

              <div className="mb-4">
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
            </div>

            <div className="mb-4 w-11/12">
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
                value={"Sign up"}
                className="w-11/12 bg-[#16989d] hover:bg-[#1f6365] hover:cursor-pointer text-white font-semibold py-2 px-4 rounded"
              />
            </div>

            <div className="flex mt-8">
              <a href="/signin">
                <h4>
                  Already have an account?&nbsp;
                  <span className="text-[#16989d] hover:underline">
                    Sign in
                  </span>
                </h4>
              </a>
            </div>
          </div>

          <div className="w-1/2">
            <img
              src="../src/assets/images/signup-img.jpg"
              alt="Image of an office room"
              className="w-full h-full object-cover rounded-r-lg"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
