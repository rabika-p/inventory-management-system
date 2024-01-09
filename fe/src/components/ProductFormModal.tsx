import { AiOutlineClose } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

interface IProductData {
  name: string;
  description: string;
  image_url: string;
  serial_num: string;
  quantity: number;
}

interface IProductFormModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  onFormSubmit: () => void; 
  productId?: string | undefined;
  product?: IProductData
}

const ProductFormModal: React.FC<IProductFormModalProps> = ({
  showModal,
  setShowModal,
  onFormSubmit,
  productId,
  product
}) => {
  // console.log('Product ID in ProductFormModal:', product);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<IProductData>();

  //reset form when product prop changes
  useEffect(() => {
    if (productId){
      reset(product);
    }
    else{ 
      reset(productValue);}
   
  }, [product, showModal])

  const productValue: IProductData = {
    name: "",
    description: "",
    image_url: "",
    serial_num: "",
    quantity: 0
  }

  const [productData, setProductData] = useState<IProductData | null>(null);


  useEffect(() => {
    if (productId) {
      axios
        .get(`http://localhost:8080/product/api/product/${productId}`)
        .then((res) => {
          const productData = res.data;
          setProductData(productData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [productId]);


  //to be called on add/edit product form submit
  const onSubmit: SubmitHandler<IProductData> = (data) => {
    //edit existing data if product id is passed
    if (productId){
      axios
      .put(`http://localhost:8080/product/api/product/${productId}`, data)
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
        setShowModal(false);
        onFormSubmit();
      })
      .catch((e) => {
        console.log(e);
      });

    }
    //add new data if there is no id
    else {
      axios
      .post("http://localhost:8080/product/api/product", data)
      .then((res) => {
        // console.log(res.data);
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
        setShowModal(false);
        onFormSubmit();
      })
      .catch((e) => {
        console.log(e);
      });
    }
  };

  const closeModal = () => {
    reset(productValue);
    setShowModal(false);
  };

  if (!showModal) {
    return null;
  }
  
  
  return (
    <div className="fixed top-0 w-full h-screen backdrop-blur-[1px] bg-white bg-opacity-25 flex justify-end z-[999]">
    <div className=' bg-slate-100 flex flex-col fixed shadow-md top-[10%] left-[24%] p-4 rounded-xl w-1/3'>
  
      <div className=" w-full max-w-md max-h-full">
        <div className=" bg-white rounded-lg shadow dark:bg-gray-700"></div>
        <div className="flex justify-end cursor-pointer">
          <AiOutlineClose onClick={() => closeModal()} />
        </div>
        <div className="flex items-center flex-col h-full w-full">
         
        <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
          {productId 
            ? 'Edit Product Details' 
            : 'Add a new product'}
        </h3>
         
          <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4">
            <div className="mb-2">
              <label className="block text-gray-600 font-semibold">
                Name:
              </label>
              <input
                type="text"
                defaultValue={productId ? productData?.name : ''}
                {...register("name", {
                  required: "The product name is required",
                })}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full py-2 px-3 mt-2
                 rounded-lg focus:ring-blue-500 focus:border-blue-500
                  block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none ${
                    errors.name ? "border-red-500" : ""
                  }
                }`}
              />
              {errors.name && (
                <p className="text-red-500 mt-2">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-gray-600 font-semibold">
                Description:
              </label>
              <textarea
              defaultValue={productId ? productData?.description : ''}
                {...register("description", {
                  required: "Description is required",
                })}
                className={`border border-gray-300 rounded w-full py-2 px-3 mt-2 text-gray-700 focus:outline-none focus:border-blue-500 ${
                  errors.description ? "border-red-500" : ""
                }`}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 mt-2">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-gray-600 font-semibold">URL:</label>
              <input
                type="text"
                defaultValue={productId ? productData?.image_url : ''}
                {...register("image_url", {
                  required: "URL is required",
                })}
                className={`border border-gray-300 rounded w-full py-2 px-3 mt-2 text-gray-700 focus:outline-none focus:border-blue-500 ${
                  errors.image_url ? "border-red-500" : ""
                }`}
              />
              {errors.image_url && (
                <p className="text-red-500 mt-2">{errors.image_url.message}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-gray-600 font-semibold">
                Serial Number:
              </label>
              <input
                type="text"
                defaultValue={productId ? productData?.serial_num : ''}
                {...register("serial_num", {
                  required: "Serial Number is required",
                })}
                className={`border border-gray-300 rounded w-full py-2 px-3 mt-2 text-gray-700 focus:outline-none focus:border-blue-500 ${
                  errors.serial_num ? "border-red-500" : ""
                }`}
              />
              {errors.serial_num && (
                <p className="text-red-500 mt-2">{errors.serial_num.message}</p>
              )}
            </div>
            <div className="mb-2">
            <label className="block text-gray-600 font-semibold">Quantity</label>
              <input
                type="number"
                defaultValue={productId ? productData?.quantity : 0}
                {...register("quantity", {
                  required: "The quantity field is required",
                  min: {
                    value: 1,
                    message: "Quantity must be greater than 1",
                  },
                  max: {
                    value: 100,
                    message: "Quantity must not be above 100",
                  },
                })}
                className="border rounded w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow appearance-none"
              />
              {errors.quantity && (
                <p className="text-red-500 text-base">{`${errors.quantity.message}`}</p>
              )}
            </div>

            <div className="pt-2 flex justify-center"> 
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {productId? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductFormModal;
