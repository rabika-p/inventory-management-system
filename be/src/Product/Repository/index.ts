import { ObjectId } from "mongodb";
import { IProduct, IProductRequest } from "./Product.types";

const { MongoClient  } = require("mongodb");

const client = new MongoClient(process.env.URI);

const database = client.db("office-inventory-system");
const usersCollection = database.collection("users");

const productsCollection = database.collection('products');
const requestsCollection = database.collection('requests');

export async function getAllProducts() {
  try {
    const products = await productsCollection.find({}).toArray();
    return products;
  } 
  catch (e) {
    console.log(e);
  }
}

export async function getProductDetails(productId : string) {
  try {
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
    return product;
  } catch (e) {
    console.error(e);
    throw e; 
  }
}

export async function addProduct(product: IProduct) {
  try {
    const { name, description, image_url, serial_num, quantity } = product;
    const in_stock = true;

    const quantityStr = typeof quantity === 'number' ? quantity.toString() : quantity;
    const quantityInt = parseInt(quantityStr, 10);
    
    const productData: IProduct = {
      name,
      description,
      image_url,
      serial_num,
      in_stock,
      quantity: quantityInt
    };

    const products = await productsCollection.insertOne(productData);
    return products;
  } 
  catch (e) {
    console.log(e);
  }
}

export async function deleteProduct(productId: string) {
  try{
    const products = await productsCollection.deleteOne({ _id: new ObjectId(productId) });
    console.log(products);
    return products;

  }
  catch(err){
    console.log(err);
  }
}

export async function updateProduct(product: IProduct, id: string) {
  try {
    const { name, description, image_url, serial_num, quantity } = product;
    const filter = { _id: new ObjectId(id) };

    const quantityStr = typeof quantity === 'number' ? quantity.toString() : quantity;
    const quantityInt = parseInt(quantityStr, 10);

    const existingProduct = await productsCollection.findOne(filter);

    console.log('Existing Product:', existingProduct);

    if (!existingProduct) {
      console.log("Product not found");
      return; 
    }

    const updateObject = {
      $set: {
        name,
        description,
        image_url,
        serial_num,
        quantity: quantityInt
      },
    };

    const products = await productsCollection.updateOne(filter, updateObject);

    console.log('Update Result:', products);

    return products;
  } catch (e) {
    console.log(e);
  }
}

//function to view requested product details along with user that requested it
export async function getAllRequestedProducts() {
  try {
    const reqProducts = await requestsCollection.aggregate([
      {
        $lookup:{
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product"
        },
      },
      {
      $lookup:{
        from: "users",
        localField: "requested_by",
        foreignField: "_id",
        as: "user"
      },
    },
    {
      $unwind: "$product",
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 1,
        "product._id": 1, 
        "product.name": 1,  
        "product.description": 1,
        "product.image_url": 1,
        "product.serial_num": 1,
        "product.quantity": 1,
        "user.firstname": 1,
        "user.lastname": 1,
        is_approved: 1,
      },
    },
  ]).toArray();
   
    return reqProducts;
  } 
  catch (e) {
    console.log(e);
  }
}

//function to add product request from user to requests collection
export async function addProductReq(product_id: string, requested_by: string) {
  try {
    const productId = new ObjectId(product_id);
    const userId = new ObjectId(requested_by);
  
    const is_approved = false;
    const reqData: IProductRequest = {
      product_id: productId,
      requested_by: userId,
      is_approved,
    };
    
    const productReq = await requestsCollection.insertOne(reqData);
    return productReq;
  } catch (e) {
    console.log(e);
  }
}

//function to view individual requested product details specific to user that logs in
export async function getIndividualRequests(userId: string) {
  try {
    const filter = ({requested_by: new ObjectId(userId) });

    const userRequests = await requestsCollection.aggregate([
      {
        $match: filter, // To filter by user ID
      },
      {
        $lookup:{
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product"
        },
      },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: 1,
        "product._id": 1, 
        "product.name": 1,  
        "product.description": 1,
        "product.image_url": 1,
        "product.serial_num": 1,
        is_approved: 1,
      },
    },
  ]).toArray();
    return userRequests;
  } 
  catch (e) {
    console.log(e);
  }
}

//function to handle approval by admin for inventory item requests by user
export const updateProductReqStatus = async (id: string, productId: string) => {
  try {
    const filter = ({_id: new ObjectId(id) });
    const filterProduct = ({_id: new ObjectId(productId) });
    const existingProduct = await productsCollection.findOne(filterProduct);

    if (existingProduct.quantity > 0) {
      // Check if quantity is greater than 0 
      const updateStatus = {
        $set: { is_approved: true },
      };
      const updateQuantity = {
        $inc: { quantity: -1 }, 
      };
      const updatedRequest = await requestsCollection.updateOne(filter, updateStatus);
      const updatedProduct = await productsCollection.updateOne(filterProduct, updateQuantity);

       //if there is only one product left, set in_stock to false after accepting user request
      if (existingProduct.quantity === 1) {
        const updateStock = {
          $set: { in_stock: false },
        };
        const updatedProduct = await productsCollection.updateOne(filterProduct, updateStock);
      }

      return {updatedRequest, updatedProduct};
  }
 
}
  catch (error) {
    console.log(error);
  }
};

//function to delete product requests
export async function deleteRequest(requestId: string) {
  try{
    const requests = await requestsCollection.deleteOne({ _id: new ObjectId(requestId) });
    return requests;

  }
  catch(err){
    console.log(err);
  }
}
