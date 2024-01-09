import { ObjectId } from "mongodb";
import * as ProductRepository from "../Repository";
import { IProduct } from "../Repository/Product.types";

export const getAllProducts = async () => {
  try {
    const products = await ProductRepository.getAllProducts();

    return products;
  } catch (err) {
    console.log(err);
  }
};

//to get product details to display in a form when edit is pressed
export const getProductDetails = async (productId: string) => {
  try {
    return await ProductRepository.getProductDetails(productId);
  } catch (err) {
    console.log(err);
  }
};

export const addProduct = async (product: IProduct) => {
  try {
    return await ProductRepository.addProduct(product);
  } catch (err) {
    console.log(err);
  }
};

export const deleteProduct = async (productId: string) =>{
  try{
    return await ProductRepository.deleteProduct(productId);
  }
  catch(err){
    console.log(err);
  }
}

export const updateProduct = async (product: IProduct, productId: string) => {
  try {
    return await ProductRepository.updateProduct(product, productId);
  }
   catch (err) {
    console.log(err);
  }
};

//function to view requested product details along with user that requested it
export const getAllRequestedProducts = async () => {
  try {
    const reqProducts = await ProductRepository.getAllRequestedProducts();

    return reqProducts;
  } catch (e) {
    console.log(e);
  }
};

//function to add product request from user to requests collection
export const addProductReq = async (productId: string, userId: string) => {
  try {
    return await ProductRepository.addProductReq(productId, userId);
  }
   catch (err) {
    console.log(err);
  }
};

//function to view individual requested product details specific to user that logs in
export const getIndividualRequests = async (userId: string) => {
  try {
    const userRequests = await ProductRepository.getIndividualRequests(userId);
    return userRequests;
  } 
  catch (e) {
    console.log(e);
  }
};

//function to handle approval by admin for inventory item requests by user
export const updateProductReqStatus = async (id: string, productId: string) => {
  try{
    const reqProducts = await ProductRepository.updateProductReqStatus(id, productId);
    return reqProducts;
  }
  catch (e) {
    console.log(e);
  }
};

//function to delete product requests
export const deleteRequest = async (requestId: string) =>{
  try{
    return await ProductRepository.deleteRequest(requestId);
  }
  catch(err){
    console.log(err);
  }
}