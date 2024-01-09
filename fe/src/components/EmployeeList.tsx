import { useState, useEffect } from "react";

import { Navigate } from "react-router-dom";
import { AsideNav } from "./AsideNav";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loading from "./Loading";

interface IEmployee {
  _id: number;
  firstname: string;
  lastname: string;
  email: string;
  position: string;
  is_active: boolean;
}

const EmployeeList = () => {
  const accessToken = localStorage.getItem("accessToken");
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const [keyword, setKeyword] = useState("");
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<IEmployee[]>([]);

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:8080/user/api/users")
      .then((response) => {
        setEmployees(response.data);
        setFilteredEmployees(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refresh]);

  //function to handle when status (active/suspended) is pressed in the table to filter employee data
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const is_active = e.target.value;
    setSelectedStatus(is_active);

    if (is_active === "all") {
      setFilteredEmployees(employees);
    } else {
      const filteredData = employees.filter(
        //to check whether isActive is true or false then filter accordingly
        (employee) => employee.is_active === (is_active === "true")
      );
      setFilteredEmployees(filteredData);
    }
  };

  //function to handle when approve is pressed
  const handleProductReqStatusChange = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const id = e.currentTarget.getAttribute("data-id");

    axios
      .put(`http://localhost:8080/user/api/user/${id}`)
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

        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
        setRefresh((prevRefresh) => !prevRefresh);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // useEffect(() => {
  //   const filtered = employees.filter(
  //     (employee) =>
  //       employee.firstname.toLowerCase().includes(keyword.toLowerCase()) ||
  //       employee.lastname.toLowerCase().includes(keyword.toLowerCase())
  //   );
  //   setfilteredEmployees(filtered);
  // }, [keyword, employees]);

  useEffect(() => {
    const filtered = employees.filter(
      (employee) =>
        employee.firstname.toLowerCase().includes(keyword.toLowerCase()) ||
        employee.lastname.toLowerCase().includes(keyword.toLowerCase())
    );

    const filteredByStatus =
      selectedStatus === "all"
        ? filtered
        : filtered.filter(
            (employee) =>
              employee.is_active === (selectedStatus === "true")
          );

    setFilteredEmployees(filteredByStatus);
  }, [keyword, selectedStatus, employees]);

  return (
    <>
      {accessToken && isAdmin ? (
        <div className="min-h-screen p-4 pt-5 bg-slate-50">
          <AsideNav />

          <div className="text-center">
            <ToastContainer />
          </div>

          <div className="ml-56 max-w-4xl mx-auto pt-6">
            <div className="mb-4">
              <h2 className="text-3xl font-semibold">Employees</h2>
            </div>
            <input
              type="text"
              placeholder="Search employee names"
              className="pt-1 w-1/2 bg-slate-100 rounded-md p-2 pl-4 pr-12 border-solid border-2"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {loading ? (
              <div>
                <Loading />
              </div>
            ) : (
              <>
                <div className="bg-white p-4 shadow-md rounded-md mt-5 w-[80vw]">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 px-4">First Name</th>
                        <th className="py-2 px-4">Last Name</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Position</th>

                        <th className="py-2 px-4">
                          <select className="" onChange={handleStatusFilter}>
                            <option value="all">Status</option>
                            <option value="true">Active</option>
                            <option value="false">Suspended</option>
                          </select>
                        </th>
                        <th className="py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee) => (
                        <tr
                          key={employee._id}
                          className="border-b border-gray-200"
                        >
                          <td className="p-2 text-center">
                            {employee.firstname}
                          </td>
                          <td className="p-2 text-center">
                            {employee.lastname}
                          </td>
                          <td className="p-2 text-center">{employee.email}</td>
                          <td className="p-2 text-center">
                            {employee.position}
                          </td>

                          <td className="p-2 text-center">
                            {employee.is_active ? (
                              <span className="text-[#62ca85] font-semibold">
                                Active
                              </span>
                            ) : (
                              <span className="text-[#ff565c] font-semibold">
                                Suspended
                              </span>
                            )}
                          </td>
                          <td className="p-4 flex items-center justify-center">
                            {employee.is_active === false ? (
                              <button
                                className="bg-[#62ca85] hover:bg-[#46b06a] flex items-center justify-center
                           text-white px-2 py-2 rounded-md"
                                data-id={employee._id}
                                data-isapproved={employee.is_active}
                                onClick={handleProductReqStatusChange}
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                className="bg-[#ff565c] hover:bg-[#ea4c51] flex items-center justify-center
                           text-white px-2 py-2 rounded-md"
                                data-id={employee._id}
                                onClick={handleProductReqStatusChange}
                              >
                                Suspend
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <Navigate to="/signin" />
      )}
    </>
  );
};

export default EmployeeList;
