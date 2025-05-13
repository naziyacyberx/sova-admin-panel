import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { checkPermission, getPagePermissions } from "../../utills/Services";
import { useNavigate } from "react-router";
import api from "../../utills/api";

interface Permission {
  page: string;
  actions: string[]; // Example: ["view", "create", "edit", "delete"]
}

interface Role {
  id: number;
  _id: string;
  name: string;
  description: string;
  status: string;
  permissions: Permission[]; // Updated field for permissions
}

export default function Roles() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [addRole, setAddRole] = useState<Role>({
    id: 0,
    _id: "",
    name: "",
    description: "",
    status: "active",
    permissions: [],
  });
  const [errors, setErrors] = useState({ name: "", description: "", permissions: "" });
  const [addRoleForm, setAddRoleForm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [authToken] = useState("Bearer YOUR_ACCESS_TOKEN");
  const [permissions, setPermissions] = useState({
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
  });

  useEffect(() => {
    const perms = getPagePermissions("Role");
    setPermissions(perms);

    if (!checkPermission("Role")) {
      navigate("/404"); // Redirect to Page Not Found
    }
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await api.get(
        `admin/api/roles/all`,
        // "https://sova-admin.cyberxinfosolution.com/admin/api/roles/all"
        {
          headers: { Authorization: authToken },
        }
      );
      // const response = await axios.get(
      //   `${process.env.REACT_APP_API_URL}admin/api/roles/all`
      //   // "https://sova-admin.cyberxinfosolution.com/admin/api/roles/all"
      //   , {
      //   headers: { Authorization: authToken },
      // });
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  const permissionsList = ["view", "create", "edit", "delete"];
  const availablePages = [
    "User",
    "Role",
    "Customer",
    "Pages",
    "CMS",
    "Home",
    "FAQ",
    "Contact-Form",
    "Header",
    "Footer",
  ];
  const handleCheckboxChange = (page: string, action: string) => {
    setAddRole((prevRole) => {
      let updatedPermissions = [...prevRole.permissions];

      // Find the index of the page in the permissions array
      const pageIndex = updatedPermissions.findIndex((p) => p.page === page);

      if (pageIndex !== -1) {
        // If the page exists, update its actions array
        let actionsSet = new Set(updatedPermissions[pageIndex].actions);

        if (actionsSet.has(action)) {
          actionsSet.delete(action); // Remove action if already present
        } else {
          actionsSet.add(action); // Add action if not present
        }

        updatedPermissions[pageIndex] = {
          ...updatedPermissions[pageIndex],
          actions: Array.from(actionsSet),
        };

        // Remove the page if no actions are left
        if (updatedPermissions[pageIndex].actions.length === 0) {
          updatedPermissions.splice(pageIndex, 1);
        }
      } else {
        // If the page is not found, add it with the new action
        updatedPermissions.push({ page, actions: [action] });
      }

      return { ...prevRole, permissions: updatedPermissions };
    });
  };

  const handleEdit = (role: Role) => setEditingRole({ ...role });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingRole) {
      setEditingRole({ ...editingRole, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!editingRole) return;
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}admin/api/roles/${editingRole._id}`,
        editingRole,
        { headers: { Authorization: authToken } }
      );
      toast.success(response.data.message);
      setRoles(
        roles.map((role) => (role._id === editingRole._id ? editingRole : role))
      );
      setEditingRole(null);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // const handleAdd = async (e: FormEvent) => {
  //   e.preventDefault();
  //   // Trigger built-in HTML5 form validation

  //   // if (!addRole) return;
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL}admin/api/roles/add`,
  //       addRole,
  //       { headers: { Authorization: authToken } }
  //     );
  //     setAddRoleForm(false);
  //     toast.success(response.data.message);
  //     setRoles([...roles, addRole]);
  //     setAddRole({
  //       id: 0,
  //       _id: "",
  //       name: "",
  //       description: "",
  //       status: "active",
  //       permissions: [],
  //     });
  //     setEditingRole(null);
  //   } catch (error: any) {
  //     toast.error(error.response.data.message);
  //     console.error("Error updating role:", error);
  //   }
  // };
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
  
    const newErrors = { name: "", description: "", permissions: "" };
    let isValid = true;
  
    if (!addRole.name.trim()) {
      newErrors.name = "Role Name is required";
      isValid = false;
    }
    if (!addRole.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }
    if (addRole.permissions.length === 0) {
      newErrors.permissions = "At least one permission must be selected";
      isValid = false;
    }
  
    setErrors(newErrors);
  
    if (!isValid) {
      return; // Stop the API call if validation failed
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}admin/api/roles/add`,
        addRole,
        { headers: { Authorization: authToken } }
      );
  
      setAddRoleForm(false);
      toast.success(response.data.message);
  
      setRoles([...roles, addRole]);
  
      setAddRole({
        id: 0,
        _id: "",
        name: "",
        description: "",
        status: "active",
        permissions: [],
      });
      fetchRoles();
      setEditingRole(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Error adding role:", error);
    }
  };
  

  const confirmDelete = (id: string) => {
    setRoleToDelete(id);
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}admin/api/roles/${roleToDelete}`,
        { headers: { Authorization: authToken } }
      );
      toast.success(response.data.message);
      setRoles(roles.filter((role) => role._id !== roleToDelete));
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setRoleToDelete(null);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}admin/api/roles/${userId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      toast.success(response.data.message);

      setRoles((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleCheckboxChangeEdit = (page: string, action: string) => {
    if (!editingRole) return;

    setEditingRole((prevRole) => {
      if (!prevRole) return null;

      let updatedPermissions = [...prevRole.permissions];

      const pageIndex = updatedPermissions.findIndex((p) => p.page === page);

      if (pageIndex !== -1) {
        let actionsSet = new Set(updatedPermissions[pageIndex].actions);

        if (actionsSet.has(action)) {
          actionsSet.delete(action);
        } else {
          actionsSet.add(action);
        }

        updatedPermissions[pageIndex] = {
          ...updatedPermissions[pageIndex],
          actions: Array.from(actionsSet),
        };

        if (updatedPermissions[pageIndex].actions.length === 0) {
          updatedPermissions.splice(pageIndex, 1);
        }
      } else {
        updatedPermissions.push({ page, actions: [action] });
      }

      return { ...prevRole, permissions: updatedPermissions };
    });
  };

  return (
    <div className="table-responsive">
      <h3 className="text-lg font-semibold">All Roles</h3>
      <div>
        {addRoleForm || editingRole ? (
          <button
            className="btn btn-secondary mb-4 float-right"
            onClick={() => {
              setAddRoleForm(false);
              setEditingRole(null);
            }}
          >
            Back{" "}
          </button>
        ) : (
          <button
            className="btn btn-dark mb-4 float-right"
            disabled={!permissions.canCreate}
            onClick={() => {
              setAddRoleForm(true);
            }}
          >
            Add +
          </button>
        )}
      </div>
      {editingRole ? (
        <div className="card p-4 w-100">
          <h4>Edit Role </h4>
          <div className="mb-3">
            <label className="form-label">Role Name</label>
            <input
              required
              type="text"
              className="form-control"
              name="name"
              value={editingRole?.name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              required
              type="text"
              className="form-control"
              name="description"
              value={editingRole.description || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            {availablePages.map((page) => (
              <div key={page} className="mb-3 border p-3 rounded">
                <h5 className="text-dark">{page} Management</h5>
                <div className="row">
                  {permissionsList.map((action) => (
                    <div key={`${page}-${action}`} className="col-md-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`${page}-${action}`}
                          checked={editingRole.permissions.some(
                            (p) => p.page === page && p.actions.includes(action)
                          )}
                          onChange={() =>
                            handleCheckboxChangeEdit(page, action)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`${page}-${action}`}
                        >
                          {action.charAt(0).toUpperCase() + action.slice(1)}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-dark" onClick={handleSave}>
            Update
          </button>
        </div>
      ) : addRoleForm ? (
        <div className="card p-4 w-100">
          <h4>Add Role</h4>
          {/* <form onSubmit={handleAdd} className="space-y-4">
            <div className="mb-3">
              <label>Role Name</label>
              <input
                required
                type="text"
                className="form-control"
                name="name"
                value={addRole?.name || ""}
                onChange={(e) => {
                  setAddRole({
                    ...addRole,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
            </div>
 
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                required
                type="text"
                className="form-control"
                name="description"
                value={addRole?.description}
                onChange={(e: any) => {
                  if (addRole) {
                    setAddRole({ ...addRole, [e.target.name]: e.target.value });
                  }
                }}
              />
            </div>
            <div>
              {availablePages.map((page) => (
                <div key={page} className="mb-3 border p-3 rounded">
                  <h5 className="text-dark">{page} Management</h5>
                  <div className="row">
                    {permissionsList.map((action) => (
                      <div key={`${page}-${action}`} className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`${page}-${action}`}
                            checked={
                              addRole.permissions
                                .find((p) => p.page === page)
                                ?.actions.includes(action) || false
                            }
                            onChange={() => handleCheckboxChange(page, action)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`${page}-${action}`}
                          >
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-dark" type="submit">
              Add
            </button>
          </form> */}

<form onSubmit={handleAdd } className="space-y-4">
      <div className="mb-3">
        <label>Role Name</label>
        <input
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          name="name"
          value={addRole.name}
          onChange={(e) => {
            setAddRole({ ...addRole, [e.target.name]: e.target.value });
            if (errors.name) setErrors({ ...errors, name: "" }); // clear error on typing
          }}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <input
          type="text"
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          name="description"
          value={addRole.description}
          onChange={(e) => {
            setAddRole({ ...addRole, [e.target.name]: e.target.value });
            if (errors.description) setErrors({ ...errors, description: "" });
          }}
        />
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
      </div>

      <div>
        {availablePages.map((page) => (
          <div key={page} className="mb-3 border p-3 rounded">
            <h5 className="text-dark">{page} Management</h5>
            <div className="row">
              {permissionsList.map((action) => (
                <div key={`${page}-${action}`} className="col-md-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`${page}-${action}`}
                      checked={
                        addRole.permissions.find((p) => p.page === page)?.actions.includes(action) || false
                      }
                      onChange={() => handleCheckboxChange(page, action)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`${page}-${action}`}
                    >
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {errors.permissions && (
          <div className="text-danger mb-3">{errors.permissions}</div>
        )}
      </div>

      <button className="btn btn-dark" type="submit">
        Add
      </button>
    </form>
        </div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Role</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* <tbody>
          (  {roles.map((role, i) => (
              <tr key={i}>
                <td>{role.name}</td>
                <td>{role.description}</td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      role.status === "active"
                        ? "btn-outline-success"
                        : "btn-outline-danger"
                    }`}
                  >
                    {role.status}
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    ⋮
                  </button>
                  <ul className="dropdown-menu">
                    {permissions.canEdit && (
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(role)}
                        >
                          Edit
                        </button>

                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleStatusToggle(role._id, role.status)
                          }
                        >
                          {role.status === "active"
                            ? "Mark Inactive"
                            : "Mark Active"}
                        </button>
                      </li>
                    )}
                    <li>
                      {permissions.canDelete && (
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => confirmDelete(role._id)}
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  </ul>
                </td>
              </tr>
            ))})
          </tbody> */}
           <tbody>
    {roles.length === 0 ? (
      <tr>
        <td colSpan={4} className="text-center">
          No Data Found
        </td>
      </tr>
    ) : (
      roles.map((role, i) => (
        <tr key={i}>
          <td>{role.name}</td>
          <td>{role.description}</td>
          <td>
            <button
                style={{ cursor: 'default' }}
              className={`btn btn-sm ${
                role.status === "active"
                  ? "btn-success"
                  : "btn-danger"
              }`}
            >
              {role.status}
            </button>
          </td>
          <td>
            <button
              className="btn btn-secondary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              ⋮
            </button>
            <ul className="dropdown-menu">
              {permissions.canEdit && (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleEdit(role)}
                  >
                    Edit
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() =>
                      handleStatusToggle(role._id, role.status)
                    }
                  >
                    {role.status === "active"
                      ? "Mark Inactive"
                      : "Mark Active"}
                  </button>
                </li>
              )}
              <li>
                {permissions.canDelete && (
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => confirmDelete(role._id)}
                  >
                    Delete
                  </button>
                )}
              </li>
            </ul>
          </td>
        </tr>
      ))
    )}
  </tbody>
        </table>
      )}

      {/* Delete Confirmation Modal */}
      <div
        className={`modal fade  ${roleToDelete ? "show d-block" : "d-none"}`}
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
                onClick={() => setRoleToDelete(null)}
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this role?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setRoleToDelete(null)}
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
    </div>
  );
}
