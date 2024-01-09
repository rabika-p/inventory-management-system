import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

interface IData {
  password: string;
}

const ResetPsw = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IData>();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IData> = async (data) => {
    await axios
      .post("http://localhost:8080/user/reset-password", data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.err) {
          const errorMessage = res.data.err.message || "An error occurred";
          toast.error(errorMessage);
        } else {
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
        }
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center mt-2">
          <ToastContainer />
        </div>
        <div className="bg-white p-8 rounded shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-sans font-bold mb-7">
            RESET <span className="text-[#2a7d80d4]">PASSWORD </span>
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 w-full">
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
                onChange={handlePasswordChange}
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

            <div className="mb-4 w-full">
              <label className="text-lg">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                autoComplete="new-password"
                className={`border rounded w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow appearance-none ${
                  passwordError ? "border-red-500" : ""
                }`}
              />
              {passwordError && (
                <p className="text-red-500 text-base">{passwordError}</p>
              )}
            </div>

            <div className="flex mt-7">
              <button
                type="submit"
                className="w-full bg-[#2a7d80d4] hover:bg-[#1f6365d4] text-white font-semibold py-2 px-4 
              rounded focus:outline-none" 
              disabled={passwordError !== ""}
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPsw;
