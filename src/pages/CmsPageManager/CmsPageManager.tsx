import React, { useEffect, useState } from "react";
import CustomEditor from "../../components/customEditor/customEditor";
import api from "../../utills/api";
import { toast } from "react-toastify";

type Page = {
  _id: number;
  name: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  slugAutoModified?: boolean;
  status?: string;
};

const CMSPageManager: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [editorContent, setEditorContent] = useState<string>("");
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [formErrors, setFormErrors] = useState({ name: "", slug: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");

  const getPages = async () => {
    try {
      const searchQuery = search.trim();
      const response = await api.get("admin/api/pages", {
        params: { search: searchQuery },
      });
      setPages(response.data.pages);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getPages();
  }, [search]);

  const handleView = (page: Page) => {
    setSelectedPage(page);
    setEditorContent(page.content || "");
    setIsViewing(true);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setSelectedPage({
      _id: 0,
      name: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      content: "",
    });
    setEditorContent("");
    setFormErrors({ name: "", slug: "" });
  };

  const handleBack = () => {
    setIsViewing(false);
    setIsAdding(false);
    setSelectedPage(null);
    setEditorContent("");
    setFormErrors({ name: "", slug: "" });
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    const payload = {
      ...selectedPage,
      content: editorContent,
    };

    try {
      if (isAdding) {
        const response = await api.post("admin/api/pages/add", payload);
        toast.success(response.data.message);
      } else {
        const response = await api.put(
          `admin/api/pages/update/${selectedPage._id}`,
          payload
        );
        toast.success(response.data.message);
      }
      await getPages();
      handleBack();
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let errors = { name: "", slug: "" };

    if (!selectedPage?.name) errors.name = "Page Name is required.";
    if (!selectedPage?.slug) errors.slug = "Slug is required.";

    if (errors.name || errors.slug) {
      setFormErrors(errors);
      return;
    }

    handleSave();
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleStatusToggle = async (_id: number, status: string) => {
    try {
      const response = await api.patch(`admin/api/pages/update/${_id}`, {
        status,
      });
      toast.success(response.data.message);
      getPages();
    } catch (error) {
      console.log("Error", error);
    }
  };
  const fetchQuery = async (event: any) => {
    let query = event.target.value;

    try {
      const response = await api.get(`admin/api/users/filter?search=${query}`, {
        // const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/api/users/filter?search=${query}`,{headers:{
        headers: { Authorization: `Bearer` },
        // headers: { Authorization: `Bearer ${authToken}` },
      });

      setPages(response?.data?.pages);
    } catch (error) {
      console.log("Error", error);
    }
  };


  const handleDelete = async (_id: string) => {
    setPageToDelete(_id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (!pageToDelete) return;
  
    try {
      const response = await api.delete(`admin/api/pages/remove/${pageToDelete}`);
      toast.success(response.data.message || "Page deleted successfully");
      getPages();
    } catch (error) {
      toast.error("Failed to delete the page.");
    } finally {
      setShowDeleteModal(false);
      setPageToDelete(null);
    }
  };
  
  
  return (
    <div>
      
      {!isViewing && !isAdding ? (
        <>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            All Pages
          </h3>
          {showDeleteModal && (
  <>
    {/* Backdrop first */}
    <div className="modal-backdrop fade show"></div>

    {/* Modal content */}
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Deletion</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowDeleteModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this page?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}

          <div className="d-flex justify-content-between align-items-start mb-3">
            <input
              type="text"
              className="form-control"
              style={{ width: "180px", maxWidth: "100%" }}
              placeholder="Search here..."
              value={search}
              onChange={(event: any) => {
                setSearch(event.target.value);
              }}
            />
            <button className="btn btn-dark" onClick={handleAdd}>
              + Add Page
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Page Name</th>
                  <th>Slug</th>
                  <th>status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page: any) => (
                  <tr key={page._id}>
                    <td>{page.name}</td>
                    <td>{page.slug}</td>
                    <td>
                      <button
                        style={{ cursor: "default" }}
                        className={`btn btn-sm ${
                          page.status === "active"
                            ? "btn-success"
                            : "btn-danger"
                        }`}
                      >
                        {page.status}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        ⋮
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              window.open(
                                `${process.env.REACT_APP_SITE_URL}${page.slug}`,
                                "_blank"
                              )
                            }
                          >
                            view
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleView(page)}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          {" "}
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              handleStatusToggle(
                                page._id,
                                page.status === "active" ? "inactive" : "active"
                              )
                            }
                          >
                            {page.status === "active"
                              ? "Mark Inactive"
                              : "Mark Active"}
                          </button>{" "}
                        </li>
                        <li>
                          <button className="dropdown-item text-danger" 
                          
                          onClick={() => handleDelete(page._id)}>
                            Delete
                          </button>
                        </li>
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={handleBack}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 mb-4"
          >
            Back to Pages
          </button>

          {selectedPage && (
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                {isAdding ? "Add New Page" : `Edit Page - ${selectedPage.name}`}
              </h3>

              {/* Page Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Page Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedPage.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = generateSlug(name);
                    setSelectedPage((prev) =>
                      prev
                        ? {
                            ...prev,
                            name,
                            slug: !prev.slugAutoModified ? autoSlug : prev.slug,
                          }
                        : null
                    );
                  }}
                />
                {formErrors.name && (
                  <div className="text-red-600">{formErrors.name}</div>
                )}
              </div>

              {/* Slug */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Slug</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedPage.slug}
                  onChange={(e) => {
                    const customSlug = generateSlug(e.target.value);
                    setSelectedPage((prev) =>
                      prev
                        ? {
                            ...prev,
                            slug: customSlug,
                            slugAutoModified: true,
                          }
                        : null
                    );
                  }}
                />
                {formErrors.slug && (
                  <div className="text-red-600">{formErrors.slug}</div>
                )}
              </div>

              {/* Meta Title */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Meta Title (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedPage.metaTitle || ""}
                  onChange={(e) =>
                    setSelectedPage((prev) =>
                      prev ? { ...prev, metaTitle: e.target.value } : null
                    )
                  }
                />
              </div>

              {/* Meta Description */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Meta Description (Optional)
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={selectedPage.metaDescription || ""}
                  onChange={(e) =>
                    setSelectedPage((prev) =>
                      prev ? { ...prev, metaDescription: e.target.value } : null
                    )
                  }
                />
              </div>

              {/* Content */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Content</label>
                <CustomEditor
                  value={editorContent}
                  onChange={setEditorContent}
                />
              </div>

              <button className="btn btn-dark mt-4" type="submit">
                Save
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CMSPageManager;
