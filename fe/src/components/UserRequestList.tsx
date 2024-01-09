import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AsideNav } from "./AsideNav";
import Loading from "./Loading";
interface IProduct {
  _id: string;
  name: string;
  description: number;
  image_url: string;
  serial_num: string;
}
interface IProductRequest {
  _id: string;
  is_approved: boolean;
  product: IProduct;
}
const UserRequestList = () => {
  const accessToken = localStorage.getItem("accessToken");
  const isUser = localStorage.getItem("role") === "USER";
  const [keyword, setKeyword] = useState("");
  const [productReqs, setProductReqs] = useState<IProductRequest[]>([]);
  const [filteredProductReqs, setFilteredProductReqs] = useState<IProductRequest[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`http://localhost:8080/product/api/product-requests/${userId}`)
      .then((response) => {
        setProductReqs(response.data);
        setFilteredProductReqs(response.data);
        // console.log(filteredProductReqs);
        setLoading(false);
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
  useEffect(() => {
    const filtered = productReqs.filter((productReq: IProductRequest) =>
      productReq.product.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredProductReqs(filtered);
  }, [keyword, productReqs]);
  return (
    <>
      {accessToken && isUser ? (
        <div className="min-h-screen p-4 pt-5 bg-slate-50">
          <AsideNav />
          <div className="text-center">
            <ToastContainer />
          </div>
          <div className="ml-56 max-w-4xl mx-auto pt-6">
            <div className="mb-4">
              <h2 className="text-3xl font-semibold">My Requests</h2>
            </div>
            {loading === false && productReqs.length === 0 ? (
              <p
                className="flex w-[80vw] h-[15vh] justify-center items-center
                 mt-4 text-[#d74c4c] italic font-bold text-lg"
              >
                You have not requested any products.
              </p>
            ) : (
              <>
                {loading ? (
                  <div>
                    <Loading />
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Search product requests"
                      className="pt-1 w-1/2 rounded-md p-2 pl-4 pr-12 border-solid border-2"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                    <div className="bg-white p-4 shadow-md rounded-md mt-5 w-[80vw]">
                      <table className="w-full table-auto border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-2 px-4">Product Name</th>
                            <th className="py-2 px-4">Serial Number</th>
                            <th className="py-2 px-4">Description</th>
                            <th className="py-2 px-4">
                              <select
                                className=""
                                onChange={handleStatusFilter}
                              >
                                <option value="all">Status</option>
                                <option value="true">Approved </option>
                                <option value="false">Pending</option>
                              </select>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProductReqs.map(
                            (request: IProductRequest) => (
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
                                  {request.product.description}
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
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
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
export default UserRequestList;
