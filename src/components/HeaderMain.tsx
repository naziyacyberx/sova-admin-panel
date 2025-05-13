interface NavLink {
  name: string;
  url: string;
  _id: string | null;
}
interface HeaderMainProps {
    title: string;
    logo: string | null;
    navLinks: NavLink[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: "logo") => void;
    // handleNavLinkChange: (index: number, value: string) => void;
    handleNavLinkChange: (index: number, field: keyof NavLink, value: string) => void;
    handleAddNavLink: () => void;
    handleRemoveNavLink: (index: number) => void;
  }
  
  export default function HeaderMain({
    title,
    logo,
    navLinks,
    handleChange,
    handleFileChange,
    handleNavLinkChange,
    handleAddNavLink,
    handleRemoveNavLink,
  }: HeaderMainProps) {
    return (
      <div className="card">
        <div className="card-header bg-secondary  text-white">Main Header Section.</div>
        <div className="card-body">
          {/* <div className="mb-3">
            <label className="form-label">Header Title</label>
            <input type="text" className="form-control" name="title" value={title} onChange={handleChange} />
          </div> */}
  
          <div className="mb-3">
            <label className="form-label">Logo</label>
            <div className="d-flex align-items-center gap-2">
              {logo && <img src={logo} alt="Logo" width="60" />}
              <input type="file" className="form-control" accept="image/*" onChange={(e) => handleFileChange(e, "logo")} />
            </div>
          </div>
  
          <div className="mb-3">
            <label className="form-label">Navigation Links</label>
            {/* {navLinks.map((link, index) => (
              <div key={index} className="d-flex gap-2 mb-2">
                <input type="text" className="form-control" value={link} onChange={(e) => handleNavLinkChange(index, e.target.value)} />
                <button type="button" className="btn btn-danger" onClick={() => handleRemoveNavLink(index)}>
                &times;

                </button>
              </div>
            ))} */}
            {navLinks && navLinks.map((link, index) => (
  <div key={link._id} className="d-flex gap-2 mb-2">
    {/* <input
      type="text"
      className="form-control"
      value={link.name} // Update to use link.name
      // onChange={(e:any) => handleNavLinkChange(index, "name")}
      placeholder="Enter link name"
    />
    <input
      type="text"
      readOnly
      className="form-control"
      value={link.url} // Update to use link.url
      // onChange={(e:any) => handleNavLinkChange(index, "url")}
      onChange={(e) => handleNavLinkChange(index, "name", e.target.value)}

      placeholder="Enter link URL"
    /> */}
    <input
  type="text"
  name="name"
     className="form-control"
  value={link.name}
  onChange={(e) => handleNavLinkChange(index, "name", e.target.value)}
/>
<input
  type="text"
  name="url"
  value={link.url}
     className="form-control"
  onChange={(e) => handleNavLinkChange(index, "url", e.target.value)}
/>

    <button
      type="button"
      className="btn btn-danger"
      onClick={() => handleRemoveNavLink(index)}
    >
      &times;
    </button>
  </div>
))}

            <button type="button" className="btn btn-secondary mt-2" onClick={handleAddNavLink}>
              ➕ Add More
            </button>
          </div>
        </div>
      </div>
    );
  }
  