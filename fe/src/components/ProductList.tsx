import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import {FiEdit2} from "react-icons/fi";
import {RiDeleteBin7Line} from "react-icons/ri";

import { AsideNav } from "./AsideNav";
import ProductFormModal from "./ProductFormModal";
import Loading from "./Loading";

interface IProduct {
  _id: number;
  name: string;
  description: string;
  image_url: string;
  in_stock: boolean;
  serial_num: string;
  quantity: number;
}

const productValue: IProduct = {
  _id: 0,
  name: "",
  description: "",
  image_url: "",
  in_stock: false,
  serial_num: "",
  quantity: 0
}

const ProductList = () => {
  const accessToken = localStorage.getItem("accessToken");
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  const [selectedStatus, setSelectedStatus] = useState("all");

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();


  const openModal = () => {
    
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProductId(""); 
    console.log("Closing", selectedProductId);
    setShowModal(false);

  };

  const openEditModal = (productId: string, product: IProduct) => {
    console.log('Selected Product ID in ProductList:', productId);
    setSelectedProductId(productId);
    setSelectedProduct(product);
    setShowModal(true);
  };

  useEffect(() => {
    axios.get('http://localhost:8080/product/api/products')
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refresh]);

  //function to handle when status (in stock/out of stock) is pressed in the table to filter product data
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const in_stock = e.target.value;
    setSelectedStatus(in_stock);

    if (in_stock === "all") {
      setFilteredProducts(products);
    } 
    else {
      const filteredData = products.filter(
        //to check whether inStock is true or false then filter accordingly
        (product) => product.in_stock === (in_stock === "true") 
      );
      setFilteredProducts(filteredData);
    }
  };

   //function to delete a product
   const handleProductDeletion = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const productId = e.currentTarget.getAttribute("data-productid");
    axios
      .delete(`http://localhost:8080/product/api/product/${productId}`)
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
      })
      setRefresh((prevRefresh) => !prevRefresh);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //when form is submitted to add product
  const handleFormSubmit = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };


  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [keyword, products]);

  return (
    <>
      {accessToken && isAdmin ? (
        <div className="min-h-screen p-4 pt-5 bg-slate-50 ">
          <AsideNav/>

          <div className="text-center">
            <ToastContainer />
          </div>

          <div  className="ml-56 max-w-4xl mx-auto pt-6">
            <div className="mb-4">
              <h2 className="text-3xl font-semibold">Inventory List</h2>
            </div>
            <div className="flex justify-between w-[80vw]">
              <input
                type="text"
                placeholder="Search products by name"
                className="pt-1 w-1/2 bg-slate-100 rounded-md p-2 pl-4 pr-12 border-solid border-2"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button
                  className="bg-[#38A3E5] hover:bg-[#489dd2] flex items-center justify-end
                  text-white px-2 py-2 rounded-md mr-5" onClick={openModal}
                    >
                  Add new product
                </button>
                <ProductFormModal showModal={showModal} setShowModal={closeModal} 
                onFormSubmit={handleFormSubmit} productId={selectedProductId || ""} 
                product = {selectedProduct ? selectedProduct : productValue }   />
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
                    <th className="py-2 px-4">Serial Number</th>
                    <th className="py-2 px-4">Description</th>
                    <th className="py-2 px-4">Quantity</th>
                    <th className="py-2 px-4"> 
                      <select className="" onChange={handleStatusFilter}>
                        <option value="all">Status</option>
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    </th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-200">
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="w-20 h-20 rounded-full overflow-hidden">
                            <img
                              src={product.image_url}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <p className="font-bold">{product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center">{product.serial_num}</td>
                      <td className="p-2 text-center">{product.description}</td>
                      <td className="p-2 text-center">{product.quantity}</td>
                      <td className="p-2  text-center">
                        {product.in_stock ? (
                          <span className="text-[#62ca85] font-semibold">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-[#ff565c] font-semibold">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 flex items-center justify-center">
                        <button
                          className="bg-[#62ca85] hover:bg-[#46b06a] flex items-center justify-center
                             text-white px-2 py-2 rounded-md mr-5" 
                             data-productid={String(product._id)} 
                             onClick={() => openEditModal(String(product._id),product)}
                        >
                          <FiEdit2 className="text-xl" />
                        </button>
                    
                        <button
                          className="bg-[#ff565c] hover:bg-[#ea4c51] flex items-center justify-center
                             text-white px-2 py-2 rounded-md"
                              data-productid={product._id}
                              onClick={handleProductDeletion}
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

export default ProductList;
