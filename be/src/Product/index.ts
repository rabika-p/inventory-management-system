import { Router } from 'express';

import * as ProductController from './Controller';
const router = Router();

const productRoutes = () => {

    router.get('/api/products', ProductController.getAllProducts);
    //to display product details in edit form
    router.get('/api/product/:productId', ProductController.getProductDetails); 
    //to update product details after being edited
    router.put('/api/product/:productId', ProductController.updateProduct); 
    router.post('/api/product', ProductController.addProduct);
    router.delete('/api/product/:productId', ProductController.deleteProduct);
    
    //for admin to view requested product details
    router.get('/api/product-requests', ProductController.getAllRequestedProducts);
    //for admin to handle approval for inventory item requests by user
    router.put('/api/product-request/:id', ProductController.updateProductReqStatus);
    //for admin to delete product request 
    router.delete('/api/product-request/:requestId', ProductController.deleteRequest);


    //for user to send product request
    router.post('/api/product-request/:productId', ProductController.addProductReq);
    //for user to view their individual product requests
    router.get('/api/product-requests/:userId', ProductController.getIndividualRequests);
    

  
    return router;

};

export default productRoutes;