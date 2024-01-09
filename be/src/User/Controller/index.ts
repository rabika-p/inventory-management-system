import { NextFunction, Request, Response } from "express";
import * as UserService from "../Service";
import { ErrorHandler } from "../Middleware";


//Code for user onboarding process

export const createAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await UserService.createAuthenticatedUser({ ...req.body }));
  } 
  catch (e) {
    res.status(400).json(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await UserService.login({ ...req.body })
    res.status(200).json(data);
  } 
  // catch (e) {
  //   res.status(401).json(e);

  catch (e:any){
    console.error("Error caught in login controller:", e);
    return ErrorHandler(e, req, res, next);
  }
};

export const forgotPsw = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const result = await UserService.forgotPsw({ ...req.body });
    res.status(200).json(result);
    
  } 
  // catch (e) {
  //   res.status(500).json(e);
  // }
  catch (e:any){
    return ErrorHandler(e, req, res, next);
  }
}

export const resetPsw = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  try {
    const result = await UserService.resetPsw(password, req.user);
    res.status(200).json(result);
  } 

  catch (e:any){
    return ErrorHandler(e, req, res, next);
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers(); 
    res.status(200).json(users); 
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

export const updateUserAccountStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const updatedUser = await UserService.updateUserAccountStatus(userId);

    res.status(200).json({ message: 'User account status updated successfully', updatedUser });;
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user account' });
  }
};


// export const getAllRequestedProducts = async (req: Request, res: Response) => {
//   try {
//     const reqProducts = await UserService.getAllRequestedProducts(); 
//     res.status(200).json(reqProducts); 
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Failed to retrieve products' });
//   }
// };

// export const updateProductReqStatus = async (req: Request, res: Response) => {
//   try {
//     const productId = req.params.productId;
//     const updateData = req.body;

//     const updatedProduct = await UserService.updateProductReqStatus(productId, updateData);

//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to update product' });
//   }
// };






