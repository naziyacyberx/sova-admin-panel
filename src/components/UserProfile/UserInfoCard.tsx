import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { GET_USER } from "../../utills/endpoint";
import api from "../../utills/api";

export default function UserInfoCard() {
  const authToken = localStorage.getItem("token"); // Check auth token
  const [loader, setLoader] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [userData, setUserData] = useState({
    _id:"",
    company: "",
    account_name: "",
    name:"",
    email: "",
    phone: "",
    status:"",
    bio: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  // Fetch user data
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(GET_USER);
        // const response = await fetchHandler(GET_USER, "", true, setLoader, "GET");
        setUserData(response.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch user data");
        console.error("Error fetching user data:", error);
      }
    };
    getData();
  }, []);

  // Handle input changes
  const handleInputChange = (e : any) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Save user data
  const handleSave = useCallback(async () => {
    setLoader(true);
  
    
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}admin/api/users/${userData._id}`, userData);
      toast.success("Profile updated successfully!");
      setIsEditing(false); // Switch back to view mode after saving
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoader(false);
    }
  }, [userData]);

  // Capitalize first letter of field names
  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      {isEditing ? (
        // Edit Form
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Edit Personal Information
          </h4>
          <form className="flex flex-col">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            {["name", "email", "phone", "status"].map((field) => (
  <div key={field} className="col-span-2 lg:col-span-1">
    <Label>{capitalizeFirstLetter(field.replace("_", " "))}</Label>
    {field === "status" ? (
      <select
        name="status"
        value={userData?.status}
        onChange={handleInputChange}
        className="form-select w-full p-2 border rounded-md"
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    ) : (
      <Input
        type="text"
        name={field}
        value={userData[field as keyof typeof userData]}
        onChange={handleInputChange}
      />
    )}
  </div>
))}

            </div>
         
            <div className="flex items-center gap-3 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={loader}>
                {loader ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        // Display User Info
        <div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                {Object.entries(userData).map(([key, value]) =>
                  ["name",  "email", "phone","status"].includes(key) ? (
                    <div key={key}>
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        {capitalizeFirstLetter(key.replace("_", " "))}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {value || "N/A"}
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
