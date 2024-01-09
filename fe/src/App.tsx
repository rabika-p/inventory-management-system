import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signin from "./components/Signin";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Landing from "./components/Landing";
// import { ProtectedRoute } from "./components/ProtectedRoute";
import ForgotPsw from "./components/ForgotPsw";
import ResetPsw from "./components/ResetPsw";
// import { AsideNav } from "./components/AsideNav";
import EmployeeList from "./components/EmployeeList";
import ProductList from "./components/ProductList";
import RequestProducts from "./components/RequestProducts";
import UserRequestList from "./components/UserRequestList";
import {io} from "socket.io-client";
import NotFound from "./components/NotFound";

function App() {
  // const accessToken = localStorage.getItem("accessToken");
  const isAdmin = localStorage.getItem("role") === "ADMIN";
  const Products = lazy(() => import("./components/ProductList"));
  const username = localStorage.getItem("username");
  const [socket, setSocket] = useState<any>(null);
  const [showUsername, setShowUsername] = useState(false);

  //establish web socket connection with server
  useEffect(()=>{
    const connection = io("http://localhost:8080");
      setSocket(connection);
    },[])

  //listen to event and log message
  useEffect(()=>{
    socket?.on("From server", (msg:any) => console.log(msg));
    socket?.emit("newUser",username );
  },[socket, username])

  useEffect(()=>{
    socket?.on("Server", (msg:any) => console.log(msg));
  })
  console.log("From App",socket);

  return (
    <div>
      <Router>
        <div>
          <Navbar socket={socket} setShowUsername={setShowUsername} />
          {/* {accessToken &&
            <AsideNav/>
        } */}
          <div className="mx-auto pt-12">
            <Routes>
              <Route path="/" element={<Landing />}></Route>
              <Route path="/signin" element={<Signin setShowUsername={setShowUsername} />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/forgot-password" element={<ForgotPsw />} />
              <Route path="/reset-password" element={<ResetPsw />} />

              {/* Admin routes */}
              {/* {isAdmin && (
                <> */}
                  {/* routes after being logged in as admin */}
                  <Route path="/home" element={<Home socket = {socket} />} />
                  <Route path="/employees" element={<EmployeeList />} />
                  <Route path="/inventory" element={<ProductList />} />
                {/* </>
              )} */}

              {/* User routes */}
              {/* {!isAdmin && ( */}
                <>
                  {/* routes after being logged in as user */}
                  <Route path="/request-products" element={<RequestProducts socket={socket} />} />
                  <Route path="/requested-products" element={<UserRequestList />}/>
                </>
              {/* )} */}

              {/* <Route path="/protected" element={<ProtectedRoute />} /> */}
              {/* 
          <Route path="/requested-products" 
          element={
            <Suspense fallback={<Loading/>}>
              <UserRequestList />
            </Suspense>
          } /> */}
                  <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
