## Inventory Management System

## Overview 
This is an Inventory Management System for an Office developed using MERN (MongoDB, Express.js, React, Node.js) stack.  
The system provides functionality for both administrator and users to manage and request inventory items.  

## User groups and Roles
**Admin**  
 Can manage employee accounts, products in the inventory, and product requests sent by users/employees 
 
**Users**  
 Can sign up, view and request list of products in inventory, and view status of requests

 ## Technologies Used  
  ### Frontend:  
  
  - React with TypeScript
  - Tailwind CSS for styling
  - Axios for API communication
  
  ### Backend:  
  
  - Node.js with Express.js & TypeScript 
  - MongoDB for database  
      
  ### Authentication:  
  
  - JSON Web Tokens (JWT)  
  
  ### Real-time Notifications:  
  
  - Socket.io for WebSocket communication  

  ### Email Communication:  

  - Nodemailer for sending password reset emails  


## Data Model Diagram
![Datamodel](https://github.com/rabika-p/inventory-management-system/assets/60596856/38e770f7-9bae-4e18-8a9e-d463cde6350f)

## Project Screenshots
**Signin Page**
![Signin](https://github.com/rabika-p/inventory-management-system/assets/60596856/42c0b54c-247a-49f5-b91a-a52bb74ba2e6)

**Admin View**
![Admin view](https://github.com/rabika-p/inventory-management-system/assets/60596856/b3b543e7-6ac5-4ed9-9130-36d80a4b63e4)

**Employee List - Admin View**
![Employee list](https://github.com/rabika-p/inventory-management-system/assets/60596856/d72f8e71-d0bf-4cb9-8026-9b47428ac2a4)

**Live Notification sent upon Product Request - Admin View**
![Notification](https://github.com/rabika-p/inventory-management-system/assets/60596856/9da59aa1-c56f-4224-8f76-a2c31749d8f6)

**Employee View**
![Employee View](https://github.com/rabika-p/inventory-management-system/assets/60596856/8da8d162-4808-4057-bd0e-3bb710650646)

## Installation

1. Clone the repository:

   git clone https://github.com/rabika-p/inventory-management-system.git  
   cd inventory-management-system  

2. Install the dependencies:  
     `cd be`  
    `npm install`  
     `cd fe`  
    `npm install`  
   
4. Set up environment variables:  
     ##### Backend (.env in be directory) 
      ###### Port for the server
      `PORT=3000`
     ###### Secret key for JWT authentication
      `JWT_SECRET=your_secret_key_here`
     ###### MongoDB URI
      `URI=your_mongodb_uri`
     ###### Email Configuration for Password Reset
      `EMAIL=your_email@example.com`  
      `PSW=your_email-password`  

## Usage  
To start the development server for both the client and the server, run the following commands:  
    `cd be`  
    `npm start`  
     `cd fe`  
    `npm run dev`
