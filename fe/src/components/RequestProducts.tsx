import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { BsSend } from "react-icons/bs";
import axios from "axios";
import {io} from "socket.io-client";


import { AsideNav } from "./AsideNav";
import { useSelector } from "react-redux";
import Loading from "./Loading";

interface IProduct {
  _id: number;
  name: string;
  description: string;
  image_url: string;
  in_stock: boolean;
  serial_num: string;
}

const RequestProducts = ({socket}:any) => {
  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");
  const isUser = localStorage.getItem("role") === "USER";

  // const {socket} = props;
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);


  const [refresh, setRefresh] = useState(false);

  const connection = io("http://localhost:8080");

  useEffect(() => {
    axios
      .get("http://localhost:8080/product/api/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refresh]); 
  
   const handleNotification = (name: String) => {
    connection.emit("sendNotification",{
      senderName: username, //change this
      receiverName: "admin123",
      productName: name
    });
  };

  //function to handle when request is pressed
  const handleProductRequest = (
    e: React.MouseEvent<HTMLButtonElement>, name: String
  ) => {
    const productId = e.currentTarget.getAttribute("data-productid");
    const userId = { userId: localStorage.getItem("userId") };
  
    axios
      .post(`http://localhost:8080/product/api/product-request/${productId}`, userId)
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
      })

      setRefresh((prevRefresh) => !prevRefresh);
      handleNotification(name);

      })
      .catch((error) => {
        console.error(error);
      });
  };


  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name && product.name.toLowerCase().includes(keyword?.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [keyword, products]);
  


  return (
    <>
      {accessToken && isUser ? (
        <div className="min-h-screen p-4 pt-5 bg-slate-50 ">
          <AsideNav />

          <div className="text-center">
            <ToastContainer />
          </div>

          <div className="ml-56 max-w-4xl mx-auto pt-6">
            <div className="mb-4">
              <h2 className="text-3xl font-semibold">Inventory List</h2>
            </div>
            <div className="flex justify-between w-[80vw]">
              <input
                type="text"
                placeholder="Search available products by name"
                className="pt-1 w-1/2 bg-slate-100 rounded-md p-2 pl-4 pr-12 border-solid border-2"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
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
                    <th className="py-2 px-4 text-center">Serial Number</th>
                    <th className="py-2 px-4 text-center">Description</th>
                    {/* <th className="py-2 px-4">
                      <select className="" onChange={handleStatusFilter}>
                        <option value="all">Status</option>
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    </th> */}
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.filter((product => product.in_stock))
                  .map((product) => (
                    <tr key={product._id} className="border-b border-gray-200">
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="w-20 h-20 rounded-full overflow-hidden">
                            <img src={product.image_url} alt={product.name} />
                          </div>
                          <div className="ml-4">
                            <p className="font-bold">{product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center">{product.serial_num}</td>
                      <td className="p-2 text-center">{product.description}</td>
                      {/* <td className="p-2  text-center">
                        {product.in_stock ? (
                          <span className="text-[#62ca85] font-semibold">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-[#ff565c] font-semibold">
                            Out of Stock
                          </span>
                        )}
                      </td> */}
                      <td className="p-4 flex items-center justify-center text-center">
                        <button
                          className="bg-[#62ca85] hover:bg-[#46b06a] flex items-center justify-center
                               text-white px-2 py-2 rounded-md mr-5"
                          data-productid={product._id}
                          onClick={(e)=>handleProductRequest(e, product.name)}
                        >
                          <BsSend className="text-xl mr-1" />
                          Request

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

export default RequestProducts;
