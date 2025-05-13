
import React, { useState, useEffect } from "react";
import axios from "axios";
import { capitalizeFirstLetter, checkPermission, getPagePermissions } from "../../utills/Services";
import {  useNavigate } from "react-router";
import api from "../../utills/api";

interface ContactSubmission {
  _id: string;
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
}


 export default function Contact() {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [authToken] = useState(
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjMwNjNlMjNkNzc2NzE1NTExN2YwZCIsImlhdCI6MTc0MDY1Njc2MSwiZXhwIjoxNzQwNjYwMzYxfQ.4Cml5BJS8JEe7ODCmne8iGrlw_ZrV9PoAhpRETJKQa0"
  );
      const [permissions, setPermissions] = useState({
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      });


  useEffect(() => {
             const perms = getPagePermissions("Contact-Form");
                setPermissions(perms);
    if (!checkPermission("Contact-Form")) {
     navigate("/404"); // Redirect to Page Not Found
    }
    fetchSubmissions();
  }, []);


  const fetchSubmissions = async () => {
    try {
      const response = await api.get("admin/api/contact", {
        headers: { Authorization: authToken },
      });


      if (Array.isArray(response.data.forms)) {
        setSubmissions(response?.data.forms);
      } else {
        console.error("Unexpected API response format", response.data);
        setSubmissions([]);
      }
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      setSubmissions([]);
    }
  };

  const handleStatusToggle = async (id: string, newStatus: string) => {
    // const newStatus = currentStatus === "New" ? "Resolved" : "New";
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}admin/api/contact/update/${id}`,
        { status: newStatus },
        { headers: { Authorization: authToken } }
      );

      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission._id === id ? { ...submission, status: newStatus } : submission
        )
      );
    } catch (error) {
      console.error("Error updating submission status:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Contact Form Submissions
      </h3>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((submission,i) => (
                <tr key={i}>
                  <td>{submission.name}</td>
                  <td>{submission.email}</td>
                  <td>{submission.message}</td>
                  <td>
                    <span className={`badge ${submission.status === "New" ? "bg-warning" : "bg-success"}`}>
                      {capitalizeFirstLetter(submission.status)}
                    </span>
                  </td>
                  <td>
                  <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    ⋮
                  </button>
                 {permissions.canEdit && <ul className="dropdown-menu">
                    <li>
                      {/* <button className="dropdown-item" onClick={() => {handleStatusToggle(submission._id,"new")}}>Mark New</button> */}
                      <li>
                        <button className="dropdown-item" onClick={() => {handleStatusToggle(submission._id,"pending")}}
                      >
                Mark Pending
                        </button>  
                      </li>
                    </li>
                    <li>
                          <button className="dropdown-item" onClick={() => {handleStatusToggle(submission._id,"resolved")}}>Mark Resolved</button>
                      {/* <button className="dropdown-item text-danger" onClick={() => confirmDelete(role._id)}>Delete</button> */}
                    </li>
                  </ul>}
                </td>
                  {/* <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleStatusToggle(submission.id, submission.status)}
                    >
                      {submission.status === "New" ? "Mark Resolved" : "Mark New"}
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>  
  );
}
