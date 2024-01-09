import { FiUsers } from "react-icons/fi";
// import { AiFillPieChart } from "react-icons/ai";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { MdInventory } from "react-icons/md";
import { NavLink } from "react-router-dom";
export const AsideNav = () => {
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  return (
    <aside className="fixed left-0 top-[4.5rem] z-40 w-52 h-screen transition-transform -translate-x-full sm:translate-x-0">
      <div
        className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 
    border-r-2 border-gray-900 border-opacity-10"
        // replace bg-white in className later
      >
        {/* check if admin is logged in or user to show different aside navbars */}
        {isAdmin && (
          <ul className="space-y-2 font-medium text-base">
            {/* <li className="">
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg
             dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
              >
                <AiFillPieChart
                  className="w-7 h-7 text-[#38A3E5] transition duration-75
             dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                />
                <span className="ml-3">Dashboard</span>
              </a>
            </li> */}

            <li>
              <NavLink
                to="/employees"
                className="flex items-center p-2 text-gray-900 rounded-lg
             dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
              >
                <FiUsers
                  className="flex-shrink-0 w-7 h-7 text-[#38A3E5] transition duration-75 dark:text-gray-400
             group-hover:text-gray-900 dark:group-hover:text-white"
                />
                <span className="ml-3">Employees</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/inventory"
                className="flex items-center p-2 text-gray-900 rounded-lg
             dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
              >
                <MdInventory
                  className="w-7 h-7 text-[#38A3E5] transition duration-75
             dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                />
                <span className="ml-3">Inventory </span>
              </NavLink>
            </li>

            <li className="">
              <NavLink
                to="/home" //change route to product-requests later
                className="flex items-center p-2 text-gray-900 rounded-lg
             dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
              >
                <BsFillPatchCheckFill
                  className="w-7 h-7 text-[#38A3E5] transition duration-75
             dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                />
                <span className="ml-3">Product Requests</span>
              </NavLink>
            </li>
          </ul>
        )}

        {!isAdmin && (
          <ul className="space-y-2 font-medium text-base">
            {/* <li className="">
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg
             dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
              >
                <AiFillPieChart
                  className="w-7 h-7 text-[#38A3E5] transition duration-75
             dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                />
                <span className="ml-3">Dashboard</span>
              </a>
            </li> */}

            <li>
              <NavLink
                to="/request-products"
                className="flex items-center p-2 text-gray-900 rounded-lg
             dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
              >
                <MdInventory
                  className="w-7 h-7 text-[#38A3E5] transition duration-75
             dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                />
                <span className="ml-3">Request Products </span>
              </NavLink>
            </li>

            <li className="">
              <NavLink
                to="/requested-products"
                className="flex items-center p-2 text-gray-900 rounded-lg
             dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
              >
                <BsFillPatchCheckFill
                  className="w-7 h-7 text-[#38A3E5] transition duration-75
             dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                />
                <span className="ml-3">My Requests</span>
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </aside>
  );
};
