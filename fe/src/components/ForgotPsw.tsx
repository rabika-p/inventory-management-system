import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

interface IData {
  email: string;
}

const ForgotPsw = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IData>();

  const onSubmit: SubmitHandler<IData> = (data) => {
    axios
      .post("http://localhost:8080/user/forgot-password", data)
      .then((res) => {
        console.log(res.data);
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
            FORGOT <span className="text-[#2a7d80d4]">PASSWORD </span>
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 W-10/12">
              <label className="block text-lg">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "The email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address format",
                  },
                })}
                className={`border border-gray-300 rounded w-full py-2 px-3 mt-2 text-gray-700 focus:outline-none focus:border-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {`${errors.email.message}`}
                </p>
              )}
            </div>

            <div className="flex mt-7">
              <button
                type="submit"
                className="w-full bg-[#2a7d80d4] hover:bg-[#1f6365d4] text-white font-semibold py-2 px-4 
              rounded focus:outline-none"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPsw;
