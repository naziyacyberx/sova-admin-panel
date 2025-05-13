import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { checkPermission, getPagePermissions } from "../../utills/Services";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../utills/api";

interface User {
  id: number;
  _id: number;
  image: string;
  name: string;
  company: string;
  account_name: string;
  role: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  createdAt: string;
}

export default function Customers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [permissions, setPermissions] = useState({
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
  });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("_id");
  const [order, setOrder] = useState("desc");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const perms = getPagePermissions("Customer");
    setPermissions(perms);

    if (!checkPermission("Customer")) {
      navigate("/404"); // Redirect to Page Not Found
    }
    getCustomers();
  }, [page, limit, search, sortBy, order, startDate, endDate]);

  const getCustomers = async () => {
    try {
      const response = await api.get("admin/api/customer/all", {
        headers: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
        },
        params: {
          search,
          sortBy,
          order,
          page,
          limit,
          startDate: startDate ? startDate.toISOString() : undefined,
          endDate: endDate ? endDate.toISOString() : undefined,
        },
        // const response = await axios.get("http://localhost:5000/admin/api/customer/all", {
        //   headers: {
        //     Authorization: `Bearer YOUR_ACCESS_TOKEN`,
        //   },
        //   params: {
        //     search,
        //     sortBy,
        //     order,
        //     page,
        //     limit,
        //     startDate: startDate ? startDate.toISOString() : undefined,
        //     endDate: endDate ? endDate.toISOString() : undefined,

        //   }
      });

      setUsers(response.data.customers);
      setPages(response.data.pages);
      // You can also store total pages, current page, etc. from response if needed
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (user: User) => setEditingUser(user);

  const handleSave = async () => {
    if (editingUser) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}admin/api/customer/${editingUser._id}`,
          editingUser,
          {
            headers: {
              Authorization: `Bearer YOUR_ACCESS_TOKEN`,
            },
          }
        );
        toast.success(response.data.message);
        setUsers(
          users.map((user) =>
            user._id === editingUser._id ? editingUser : user
          )
        );
        setEditingUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleStatusToggle = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}admin/api/customer/${userId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer YOUR_ACCESS_TOKEN`,
          },
        }
      );

      toast.success(response.data.message);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}admin/api/customer/${userToDelete._id}`,
          {
            headers: {
              Authorization: `Bearer YOUR_ACCESS_TOKEN`,
            },
          }
        );
        toast.success(response.data.message);
        setUsers(users.filter((user) => user._id !== userToDelete._id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
      setUserToDelete(null);
    }
  };

  const handleExport = () => {
    if (!users || users.length === 0) return;

    const headers: (keyof any)[] = [
      "email",
      "account_name",
      "company",
      "status",
      "phone",
      "country",
    ];
    const csvHeaders = headers.join(",");

    const csvRows = users.map((user: any) =>
      headers
        .map((header) => {
          const value = user[header];
          return `"${
            value !== undefined && value !== null && value !== ""
              ? String(value).replace(/"/g, '""')
              : "NA"
          }"`;
        })
        .join(",")
    );

    const csvContent = [csvHeaders, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "customer_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="table-responsive">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        All Customers
      </h3>
      <div className="d-flex justify-content-between align-items-start mb-3">
        {/* Search Input - Left Aligned */}
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control "
            style={{ width: "180px", maxWidth: "100%" }}
            placeholder="Search here..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
          <div className="d-flex align-items-center gap-2">
            {/* From Date */}
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              placeholderText="From date"
              className="form-control"
              maxDate={endDate || undefined}
              isClearable
            />

            {/* To Date */}
            <DatePicker
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              placeholderText="To date"
              className="form-control"
              minDate={startDate || undefined}
              isClearable
            />

            {/* Cancel Button */}
            {(startDate || endDate) && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>

          {/* <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update: any) => {
              const [start, end] = update;
              setStartDate(start);
              setEndDate(end);
            }}
            placeholderText="Select date range"
            className="form-control"
          />
          {(startDate || endDate) && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
              }}
            >
              Cancel
            </button>
          )} */}
        </div>

        {/* Buttons - Right Aligned */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-dark  d-flex align-items-center gap-1"
            onClick={handleExport}
          >
            <svg
              width={20}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5L11.2929 4.29289L12 3.58579L12.7071 4.29289L12 5ZM13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14L13 14ZM6.29289 9.29289L11.2929 4.29289L12.7071 5.70711L7.70711 10.7071L6.29289 9.29289ZM12.7071 4.29289L17.7071 9.29289L16.2929 10.7071L11.2929 5.70711L12.7071 4.29289ZM13 5L13 14L11 14L11 5L13 5Z"
                fill="#33363F"
              />
              <path
                d="M5 16L5 17C5 18.1046 5.89543 19 7 19L17 19C18.1046 19 19 18.1046 19 17V16"
                stroke="#33363F"
                strokeWidth="2"
              />
            </svg>
            <span className="color-dark">Export</span>
          </button>
        </div>
      </div>
      {editingUser ? (
        <>
          <div>
            <button
              className="btn btn-secondary mb-4 float-right"
              onClick={() => {
                setEditingUser(null);
              }}
            >
              Back{" "}
            </button>
          </div>
          <div className="card p-4 w-100">
            <h4>Edit User</h4>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="form-control "
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Account Name</label>
              <input
                type="text"
                name="account_name"
                value={editingUser.account_name}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    account_name: e.target.value,
                  })
                }
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="company"
                value={editingUser.company}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, company: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                value={editingUser.phone}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="country"
                value={editingUser.country}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
                className="form-control"
              />
            </div>

            <button className="btn btn-dark" onClick={handleSave}>
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                {/* Name column */}

                <th
                  style={{
                    width: "160px",
                    minWidth: "120px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Email</span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "8px",
                        fontSize: "12px",
                        lineHeight: "12px",
                      }}
                    >
                      <span
                        onClick={() => {
                          setSortBy("email");
                          setOrder("asc");
                        }}
                        style={{
                          color:
                            sortBy === "email" && order === "asc"
                              ? "black"
                              : "grey",
                        }}
                      >
                        ▲
                      </span>
                      <span
                        onClick={() => {
                          setSortBy("email");
                          setOrder("desc");
                        }}
                        style={{
                          color:
                            sortBy === "email" && order === "desc"
                              ? "black"
                              : "grey",
                        }}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                </th>

                {/* Email column */}
                <th
                  style={{
                    width: "250px",
                    minWidth: "200px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span> Account Name</span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "8px",
                        fontSize: "12px",
                        lineHeight: "12px",
                      }}
                    >
                      <span
                        onClick={() => {
                          setSortBy("account_name");
                          setOrder("asc");
                        }}
                        style={{
                          color:
                            sortBy === "account_name" && order === "asc"
                              ? "black"
                              : "grey",
                        }}
                      >
                        ▲
                      </span>
                      <span
                        onClick={() => {
                          setSortBy("account_name");
                          setOrder("desc");
                        }}
                        style={{
                          color:
                            sortBy === "account_name" && order === "desc"
                              ? "black"
                              : "grey",
                        }}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                </th>

                {/* Phone column */}
                <th
                  style={{
                    width: "180px",
                    minWidth: "150px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Company</span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "8px",
                        fontSize: "12px",
                        lineHeight: "12px",
                      }}
                    >
                      <span
                        onClick={() => {
                          setSortBy("company");
                          setOrder("asc");
                        }}
                        style={{
                          color:
                            sortBy === "company" && order === "asc"
                              ? "black"
                              : "grey",
                        }}
                      >
                        ▲
                      </span>
                      <span
                        onClick={() => {
                          setSortBy("company");
                          setOrder("desc");
                        }}
                        style={{
                          color:
                            sortBy === "company" && order === "desc"
                              ? "black"
                              : "grey",
                        }}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                </th>
                <th style={{ width: "120px" }}>Created At</th>
                <th style={{ width: "120px" }}>Status</th>
                <th style={{ width: "100px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    No Data Found
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={i}>
                    <td>{user.email}</td>
                    <td>{user.account_name}</td>
                    <td>{user.company}</td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>

                    <td>
                      <button
                        style={{ cursor: "default" }}
                        className={`btn btn-sm ${
                          user.status === "active"
                            ? "btn-success"
                            : "btn-danger"
                        }`}
                        // onClick={() => handleStatusToggle(user._id, user.status)}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td>
                      {/* <div className="dropdown"> */}
                      <button
                        className="btn btn-secondary btn-sm dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        ⋮
                      </button>
                      <ul className="dropdown-menu">
                        {permissions.canEdit && (
                          <>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleEdit(user)}
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  handleStatusToggle(user._id, user.status)
                                }
                              >
                                {user.status === "active"
                                  ? "Mark Inactive"
                                  : "Mark Active"}
                              </button>
                            </li>
                          </>
                        )}
                        <li>
                          {permissions.canDelete && (
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => setUserToDelete(user)}
                            >
                              Delete
                            </button>
                          )}
                        </li>
                      </ul>
                      {/* </div> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
            {/* Per Page Dropdown */}
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="perPageSelect" className="mb-0 fw-semibold">
                Rows per page:
              </label>
              <select
                id="perPageSelect"
                className="form-select"
                style={{ width: "auto" }}
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1); // Reset to first page on limit change
                }}
              >
                {[5, 10, 20, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              <span>
                Page <strong>{page}</strong> of <strong>{pages}</strong>
              </span>

              <button
                className="btn btn-secondary"
                onClick={() => setPage(page + 1)}
                disabled={page === pages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      {userToDelete && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUserToDelete(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete {userToDelete.account_name}?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setUserToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
