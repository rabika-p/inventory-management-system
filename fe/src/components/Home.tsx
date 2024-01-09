import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { AiOutlineCheck } from "react-icons/ai";
import { RiDeleteBin7Line } from "react-icons/ri";

import { AsideNav } from "./AsideNav";
import { useSelector } from "react-redux";
import Loading from "./Loading";

interface IProduct {
  _id: string;
  name: string;
  quantity: number;
  image_url: string;
  serial_num: string;
}

interface IUser {
  firstname: string;
  lastname: string;
}

interface IProductRequest {
  _id: string;
  is_approved: boolean;
  product: IProduct;
  user: IUser;
}

const Home = ({ socket }: any) => {
  const accessToken = localStorage.getItem("accessToken");
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const [keyword, setKeyword] = useState("");
  const [productReqs, setProductReqs] = useState<IProductRequest[]>([]);
  const [filteredProductReqs, setFilteredProductReqs] = useState<IProductRequest[]>([]);

  const [refresh, setRefresh] = useState(false);
  const [notification, setNotification] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:8080/product/api/product-requests")
      .then((response) => {
        setProductReqs(response.data);
        setFilteredProductReqs(response.data);
        setLoading(false);
        // console.log(filteredProductReqs);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refresh]);

  //function to handle when status (in stock/out of stock) is pressed in the table to filter product data
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const is_approved = e.target.value;
    setSelectedStatus(is_approved);

    if (is_approved === "all") {
      setFilteredProductReqs(productReqs);
    } else {
      const filteredData = productReqs.filter(
        //to check whether is_approved is true or false then filter accordingly
        (product) => product.is_approved === (is_approved === "true")
      );
      setFilteredProductReqs(filteredData);
    }
  };

  //function to handle when approve is pressed
  const handleProductReqStatusChange = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const id = e.currentTarget.getAttribute("data-id");
    const productId = e.currentTarget.getAttribute("data-productid");
    let isApproved = e.currentTarget.getAttribute("data-isapproved") === "true";
    console.log("Before API Call - isApproved:", isApproved);
    axios
      .put(`http://localhost:8080/product/api/product-request/${id}`, {
        productId,
      })
      .then((res) => {
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
        isApproved = true;
        console.log("After API Call - isApproved:", isApproved);
        setRefresh((prevRefresh) => !prevRefresh);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //function to delete a request
  const handleReqDeletion = (e: React.MouseEvent<HTMLButtonElement>) => {
    const requestId = e.currentTarget.getAttribute("data-id");
    axios
      .delete(`http://localhost:8080/product/api/product-request/${requestId}`)
      .then((res) => {
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
        setRefresh((prevRefresh) => !prevRefresh);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const filtered = productReqs.filter((productReq: IProductRequest) =>
      productReq.product.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredProductReqs(filtered);
  }, [keyword, productReqs]);

  const notify = useSelector((c: any) => {
    const notificationData = c.notification.name;
    // console.log("Home", notification);
    return notificationData;
  });

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("getNotification", (data: any, name: any) => {
  //       console.log("Username", data, name);
  //       setNotification((prev: any) => [data, ...prev]);
  //     });
  //   }
  //   return () => {
  //     if (socket) {
  //       socket.off("getNotification");
  //     }
  //   };
  // }, [socket]);
  
  useEffect(() => {
    const handleNotification = (data: any, name: any) => {
      console.log("Username", data, name);
      setNotification((prev: any) => [data, ...prev]);
    };
  
    if (socket) {
      socket.on("getNotification", handleNotification);
    }
  
    return () => {
      if (socket) {
        socket.off("getNotification", handleNotification);
      }
    };
  }, [socket]);
  
  
  console.log("Home Array", notification);

  useEffect(() => {
    if (!accessToken) {
      setNotification([]);
    }
  }, [accessToken]);

  return (
    <>
      {accessToken && isAdmin ? (
        <div className="min-h-screen p-4 pt-5 bg-slate-50">
          <AsideNav />

          <div className="text-center">
            <ToastContainer />
          </div>

          {notify && (
            <div className="ml-56 float-right p-2 mt-1 bg-white rounded shadow-lg">
              {notification.map((a: any, index: number) => (
                <div key={index} className="text-black mb-1">
                  {" "}
                  {a.senderName} has requested a {a.productName}
                </div>
              ))}
            </div>
          )}

          <div className="ml-56 max-w-4xl mx-auto pt-6">
            <div className="mb-4">
              <h2 className="text-3xl font-semibold">Product Requests</h2>
            </div>
            <input
              type="text"
              placeholder="Search product requests"
              className="pt-1 w-1/2 rounded-md p-2 pl-4 pr-12 border-solid border-2"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {loading ? (
              <div>
                <Loading />
              </div>
            ) : (
              <>
                <div className="bg-white p-4 shadow-md rounded-md mt-5 w-[80vw]">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 px-4">Product Name</th>
                        <th className="py-2 px-4">Serial Number</th>
                        <th className="py-2 px-4">Quantity</th>
                        <th className="py-2 px-4">
                          <select className="" onChange={handleStatusFilter}>
                            <option value="all">Status</option>
                            <option value="true">Approved </option>
                            <option value="false">Pending</option>
                          </select>
                        </th>
                        <th className="py-2 px-4">Requested By</th>
                        <th className="py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProductReqs.map((request: IProductRequest) => (
                        <tr
                          key={request._id}
                          className="border-b border-gray-200"
                        >
                          <td className="p-2">
                            <div className="flex items-center">
                              <div className="w-20 h-20 rounded-full overflow-hidden">
                                <img
                                  src={request.product.image_url}
                                  alt={request.product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <p className="font-bold">
                                  {request.product.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            {request.product.serial_num}
                          </td>
                          <td className="p-2 text-center">
                            {request.product.quantity}
                          </td>
                          <td className="p-2 text-center">
                            {request.is_approved ? (
                              <span className="text-[#62ca85] font-semibold">
                                Approved
                              </span>
                            ) : (
                              <span className="text-[#e9be3e] font-semibold">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="p-2 text-center">{`${request.user.firstname} ${request.user.lastname}`}</td>
                          <td className="p-4 pt-8 flex items-center justify-center">
                            {/* display approve button only if is_approved is false */}
                            {!request.is_approved && (
                              <button
                                className="bg-[#62ca85] hover:bg-[#46b06a] flex items-center justify-center
                         text-white px-2 py-2 rounded-md mr-5"
                                data-id={request._id}
                                data-productid={request.product._id}
                                data-isapproved={request.is_approved}
                                onClick={handleProductReqStatusChange}
                              >
                                <AiOutlineCheck className="text-xl" />
                              </button>
                            )}
                            <button
                              className="bg-[#ff565c] hover:bg-[#ea4c51] flex items-center justify-center
                       text-white px-2 py-2 rounded-md"
                              data-id={request._id}
                              onClick={handleReqDeletion}
                            >
                              <RiDeleteBin7Line className="text-xl" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <Navigate to="/signin" />
      )}
    </>
  );
};

export default Home;
