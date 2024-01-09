import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Button from "./Button";
import { IoMdPerson, IoIosArrowDown } from "react-icons/io";
import { BsFillBellFill } from "react-icons/bs";

import { setNotificationData } from "../features/NotificationSlice";

interface INavbarProps {
  setShowUsername: (value: boolean) => void;
  socket: any;
}

const Navbar = ({socket, setShowUsername}: INavbarProps) => {
  const location = useLocation();

  const [changeShadow, setShadow] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // const [showUsername, setShowUsername] = useState(false);
  const [notification, setNotification] = useState<any>([]);
  const [showNotification, setShowNotification] = useState(true);
  // const [bellClicked, setBellClicked] = useState(false);

  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const accessToken = localStorage.getItem("accessToken");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  // useEffect(() => {
  //   if (accessToken) {
  //     setTimeout(() => {
  //       setShowUsername(true);
  //     }, 3000); 
  //   }
  // }, [location.pathname]);


  useEffect(() => {
    if (accessToken) {
      setTimeout(() => {
        setShowUsername(true);
      }, 3000); 
    }
  }, [accessToken]);

   useEffect(() => {
    if (socket) {
      socket.on("getNotification", (data:any)=>{
        console.log("Username", data);
        // setNotification((prev:any)=> [data, ...prev]);
        const notificationArr = [...notification];
        notificationArr.push(data);
        console.log("array", notificationArr);
        setNotification(notificationArr);
        // setBellClicked(true);
      })
    }
  });
  console.log(notification);

  //can access data from everywhere now 
  const data = useSelector((c: any) => {
    const username = c.username.name;
    return username;
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      setShadow("shadow-md");
    } else {
      setShadow("shadow-none");
    }
  });

  const displayNotification=()=>{
    setShowNotification(!showNotification);
    // console.log("Nav", showNotification);
    dispatch(setNotificationData(showNotification));
    
  }

// const notificationCount = notification.length;

  return (
    <nav className={`flex justify-between p-4 bg-white px-14 w-full fixed ${changeShadow}`}>
      <div className="flex items-center">
        <a href="/">
          <h1 className="ml-4 text-3xl font-semibold font-mono text-[#e5b337]">
            Inventory
          </h1>
        </a>
      </div>
      {location.pathname !== "/signin" && location.pathname !== "/signup" && (
        <div className="flex items-center">
          {accessToken && (
            <>
            <div className="mr-5">
              {isAdmin && (
                <>
                <BsFillBellFill
                  className="text-xl text-gray-700"
                  onClick={displayNotification}
                />
                 {/* {notificationCount > 0 && (
                  <span className="absolute top-4 ml-3 bg-red-500 text-white rounded-full text-xs px-1">
                        {notificationCount}
                      </span>
                    )} */}
                </>
              )}
            </div>
        
  
          <div className="relative inline-block text-left">
            <button
              onClick={toggleDropdown}
              className={`text-white bg-[#e5b337] hover:bg-[#d4a036] focus:ring-4 focus:outline-none focus:ring-[#ffbf00] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
              type="button"
            >
              <span className="flex items-center">
                <IoMdPerson className="w-4 h-4 mr-2" />
                {localStorage.getItem("username")}
                <IoIosArrowDown className="w-4 h-4 ml-1" />
              </span>
            </button>
  
            {isDropdownOpen && (
              <div className="absolute right-0 w-full mt-1 bg-white divide-y divide-gray-200 rounded-lg shadow dark:bg-gray-700">
                <button
                  onClick={() => {
                    handleLogout();
                    closeDropdown();
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          </>
            )}
        </div>
      )}
       {(location.pathname === "/" ||
        location.pathname === "/forgot-password") && (
        <div className="flex gap-4">
          <a href="/signin">
            <Button
              variant="primary"
              label="Sign In"
              value="Signin"
              customStyling="p-3 rounded-lg w-28 h-12 md:w-28 text-base cursor-pointer bg-[#f2f2f2] shadow-md"
            />
          </a>
          <a href="/signup">
            <Button
              variant="secondary"
              label="Sign Up"
              value="Signup"
              customStyling="p-3 ml-2 rounded-lg w-28 h-12 md:w-28 text-base cursor-pointer bg-[#e5b337] text-white shadow-md"
            />
          </a>
        </div>
      )}
    </nav>
  );  
};

export default Navbar;
