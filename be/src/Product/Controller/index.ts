import { NextFunction, Request, Response } from "express";
import * as ProductService from "../Service";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const reqProducts = await ProductService.getAllProducts(); 
    res.status(200).json(reqProducts); 
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

export const getProductDetails = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const product = await ProductService.getProductDetails(productId); 
    res.status(200).json(product); 
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to retrieve product details' });
  }
};

export const addProduct = async (req: Request, res: Response) =>{
  try {
    const addProduct = await ProductService.addProduct({ ...req.body });

    res.status(200).json({ message: 'Product added successfully', addProduct });
  } 
  catch (e) {
    res.status(400).json(e);
  }
}

export const deleteProduct = async(req: Request, res: Response) =>{
  try{
    const productId = req.params.productId;
    const product =  await ProductService.deleteProduct(productId);
    res.status(200).json({message: 'Product deleted successfully', product});
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: 'Failed to delete product'})
  }
}

export const updateProduct = async (req: Request, res: Response) =>{
  try {
    const productId = req.params.productId;
    const updatedProductData = req.body;
    console.log('productId:', productId);
    console.log('updatedProductData:', updatedProductData);

    const updateProduct = await ProductService.updateProduct(updatedProductData, productId);

    res.status(201).json({ message: 'Product updated successfully', updateProduct });
  } 
  catch (e) {
    res.status(400).json(e);
  }
}

//function to view requested product details along with user that requested it
export const getAllRequestedProducts = async (req: Request, res: Response) => {
  try {
    const reqProducts = await ProductService.getAllRequestedProducts(); 
    res.status(200).json(reqProducts); 
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to retrieve requested products' });
  }
};

//function to add product request from user to requests collection
export const addProductReq = async (req: Request, res: Response) =>{
  try {
    const productId = req.params.productId;
    const userId = req.body.userId;

    const addProductReq = await ProductService.addProductReq(productId, userId);

    res.status(200).json({ message: 'Product requested successfully', addProductReq });
  } 
  catch (e) {
    res.status(400).json(e);
  }
}

//function to view individual requested product details specific to user that logs in
export const getIndividualRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userRequests = await ProductService.getIndividualRequests(userId); 
    res.status(200).json(userRequests); 
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to retrieve requested products' });
  }
};

//function to handle approval by admin for inventory item requests by user
export const updateProductReqStatus = async (req: Request, res: Response) => {
  try {
    const productReqId = req.params.id;
    const productId = req.body.productId;

    // const isApproved = req.body.is_approved;

    // console.log(productReqId);


    const updatedProductReq = await ProductService.updateProductReqStatus(productReqId, productId);

    res.status(200).json({ message: 'Product status updated successfully', updatedProductReq });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

//function to delete product requests
export const deleteRequest = async(req: Request, res: Response) =>{
  try{
    const requestId = req.params.requestId;
    const request =  await ProductService.deleteRequest(requestId);
    res.status(200).json({message: 'Request deleted successfully', request});
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: 'Failed to delete request'})
  }
}