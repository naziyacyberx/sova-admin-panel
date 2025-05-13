
import React from "react";

interface SocialIcon {
  name: string;
  url: string;
  icon?: string | null;
}
interface NavLink {
  name: string;
  url: string;
  _id: string | null;
}

interface HeaderTopProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "social", index?: number) => void;
  handleSocialChange: (index: number, field: keyof SocialIcon, value: string) => void;
  handleAddSocialIcon: () => void;
  handleRemoveSocialIcon: (index: number) => void;
  selectedLanguage: string;
  title: string;
  logo: string | null;
  navLinks: NavLink[];
  socialIcons: SocialIcon[];
  handleLanguageChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

// ✅ Pass `HeaderTopProps` as the type for props
const HeaderTop: React.FC<HeaderTopProps> = ({
  
  handleChange,
  handleFileChange,
  handleSocialChange,
  handleAddSocialIcon,
  handleRemoveSocialIcon,
  selectedLanguage,
  title,
  logo,
  navLinks,
  socialIcons,
  handleLanguageChange,
}) => {





  return (
    <div className="card mb-4">
           <div className="card-header bg-secondary text-white">Header Top Section</div>
           <div className="card-body">
             <div className="mb-3">
               <label className="form-label">Social Media Links</label>
               {socialIcons && socialIcons?.map((icon, index) => (
                <div key={index} className="mb-3">
                  {/* <label className="form-label">{icon.name} Icon</label> */}
                  <div className="d-flex align-items-center gap-2">
                    {icon.icon && <img src={icon.icon} alt="Social Icon" width="40" height="40" />}
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e,"logo", index)}
                    />
                        <input
                      type="text"
                      className="form-control "
                      value={icon.url}
                      onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                      placeholder={`Enter ${icon.name} URL`}
                    />
                    <button
                      type="button"
                      className="btn btn-danger "
                      onClick={() => handleRemoveSocialIcon(index)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="d-flex gap-2">
                    {/* <input
                      type="text"
                      className="form-control mt-2"
                      value={icon.url}
                      onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                      placeholder={`Enter ${icon.name} URL`}
                    />
                    <button
                      type="button"
                      className="btn btn-danger mt-2"
                      onClick={() => handleRemoveSocialIcon(index)}
                    >
                      &times;
                    </button> */}
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-secondary mt-2" onClick={handleAddSocialIcon}>
                ➕ Add More
              </button>
            </div>
    
            <div className="mb-3">
              <label className="form-label">Select Default Language</label>
              <select className="form-select" value={selectedLanguage} onChange={(e)=>handleLanguageChange(e)}>
                <option value="English">English</option>
                {/* <option value="Turkish">Turkish</option> */}
              </select>
            </div>
          </div>
        </div>
  );
};

export default HeaderTop;
