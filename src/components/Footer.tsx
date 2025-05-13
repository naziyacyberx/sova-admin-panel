"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

interface LinkItem {
  name: string;
  url: string;
  _id?: string;
}

interface Section {
  name: string;
  link: LinkItem[];
  _id?: string;
}

interface SocialLink {
  icon: string; // Store image URL instead of icon name
  url: string;
  _id?: string;
}

interface FooterData {
  _id?: string;
  logoUrl: string; // base64 string after update, can be undefined
  socialLinks: SocialLink[];
  sections: Section[];
  lastSection: {
    newsletter: {
      title: string;
      description: string;
    };
    name: string;
  };
  copyright: string;
}

export default function Footer() {
  const navigate = useNavigate();
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}admin/api/footer`
        );
        setFooterData(response.data.footer);
      } catch (error: any) {
        console.error("Error fetching footer data:", error);
        toast.error(error?.message || "Failed to fetch footer data");
      }
    };

    fetchFooterData();
  }, [navigate]);

  const handleInputChange = (
    sectionIndex: number,
    linkIndex: number,
    field: keyof LinkItem,
    value: string
  ) => {
    if (!footerData) return;
    const updatedSections = [...footerData.sections];
    updatedSections[sectionIndex].link[linkIndex][field] = value;
    setFooterData({ ...footerData, sections: updatedSections });
  };

  const handleSectionNameChange = (index: number, value: string) => {
    if (!footerData) return;
    const updatedSections = [...footerData.sections];
    updatedSections[index].name = value;
    setFooterData({ ...footerData, sections: updatedSections });
  };

  const handleNewsletterChange = (
    field: keyof FooterData["lastSection"]["newsletter"],
    value: string
  ) => {
    if (!footerData) return;
    const updatedNewsletter = {
      ...footerData.lastSection.newsletter,
      [field]: value,
    };
    setFooterData({
      ...footerData,
      lastSection: { ...footerData.lastSection, newsletter: updatedNewsletter },
    });
  };

  const handleSocialLinkChange = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    if (!footerData) return;
    const updatedSocialLinks = [...footerData.socialLinks];
    updatedSocialLinks[index][field] = value;
    setFooterData({ ...footerData, socialLinks: updatedSocialLinks });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString() || "";
      setFooterData((prev) => ({
        ...prev!,
        logoUrl: base64String || prev?.logoUrl || "", // Default to empty string if undefined
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const uploadedImageUrl = reader.result?.toString() || "";
      if (footerData) {
        // Ensure footerData is not null
        const updatedSocialLinks = [...footerData.socialLinks];
        updatedSocialLinks[index].icon = uploadedImageUrl;
        setFooterData({ ...footerData, socialLinks: updatedSocialLinks });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}admin/api/footer/`,
        footerData
      );
      toast.success("Footer data updated successfully");
    } catch (error: any) {
      console.error("Error saving footer data:", error);
      toast.error("Failed to save footer data");
    }
  };
  const handleAddLink = (sectionIndex: number) => {
    if (!footerData) return;
    const updatedSections = [...footerData.sections];
    updatedSections[sectionIndex].link.push({ name: "", url: "" });
    setFooterData({ ...footerData, sections: updatedSections });
  };

  const handleRemoveLink = (sectionIndex: number, linkIndex: number) => {
    if (!footerData) return;
    const updatedSections = [...footerData.sections];
    updatedSections[sectionIndex].link = updatedSections[sectionIndex].link.filter(
      (_, i) => i !== linkIndex
    );
    setFooterData({ ...footerData, sections: updatedSections });
  };
  
  
  if (!footerData) return <div>Loading...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Edit Footer</h2>
        <button className="btn btn-dark" onClick={handleSave}>
          Save
        </button>
      </div>

      <hr />
      <h5 className="mb-3">Logo</h5>
      <div className="mb-4 d-flex align-items-center border rounded p-3 gap-4">
        {footerData.logoUrl && (
          <img
            src={footerData.logoUrl}
            alt="Logo"
            width={100}
            height={100}
            style={{ objectFit: "contain" }}
            className="border rounded"
          />
        )}
        <div>
          <input type="file" accept="image/*" onChange={handleLogoChange} />
          <small className="text-muted d-block mt-1">
            Upload a new logo image
          </small>
        </div>
      </div>

      <div className="mb-4 border rounded p-2">
        <h5 className="mb-3">Social Media Links</h5>
        {footerData.socialLinks.map((social, index) => (
          <div className="d-flex align-items-center mb-2" key={index}>
            {/* Image Upload */}
            {/* {social.icon && ( */}
              <img
                src={social.icon || "/images/placeholder_image.png"}
                alt={`icon`}
                width={30}
                height={30}
                className="mr-2"
              />
            {/* )} */}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(index, e)}
              className="form-control mr-2"
            />
            <input
              type="text"
              className="form-control me-2"
              placeholder="URL"
              value={social.url}
              onChange={(e) =>
                handleSocialLinkChange(index, "url", e.target.value)
              }
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                const updatedLinks = footerData.socialLinks.filter(
                  (_, i) => i !== index
                );
                setFooterData({ ...footerData, socialLinks: updatedLinks });
              }}
            >
              x
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn text-white bg-secondary  mt-2"
          onClick={() =>
            setFooterData({
              ...footerData,
              socialLinks: [...footerData.socialLinks, { icon: "", url: "" }],
            })
          }
        >
          Add Social Media Link
        </button>
      </div>

      <div className="mb-4">
        {/* <h4>Sections</h4> */}
        {footerData.sections.map((section, sectionIndex) => (
          <>
                   <h5>Section {sectionIndex + 1}</h5>
          <div key={sectionIndex} className="mb-3 border rounded p-2">

            <input
              type="text"
              className="form-control mb-2"
              value={section.name}
              onChange={(e) =>
                handleSectionNameChange(sectionIndex, e.target.value)
              }
              placeholder="Section Title"
            />
            {/* {section.link.map((link, linkIndex) => (
              <div className="d-flex align-items-center mb-2" key={linkIndex}>
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Link Name"
                  value={link.name}
                  onChange={(e) =>
                    handleInputChange(
                      sectionIndex,
                      linkIndex,
                      "name",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Link URL"
                  value={link.url}
                  onChange={(e) =>
                    handleInputChange(
                      sectionIndex,
                      linkIndex,
                      "url",
                      e.target.value
                    )
                  }
                />
              </div>
            ))} */}
            {section.link.map((link, linkIndex) => (

              <>
  <div className="d-flex align-items-center mb-2" key={linkIndex}>

    <input
      type="text"
      className="form-control me-2"
      placeholder="Link Name"
      value={link.name}
      onChange={(e) =>
        handleInputChange(
          sectionIndex,
          linkIndex,
          "name",
          e.target.value
        )
      }
      />
    <input
      type="text"
      className="form-control me-2"
      placeholder="Link URL"
      value={link.url}
      onChange={(e) =>
        handleInputChange(
          sectionIndex,
          linkIndex,
          "url",
          e.target.value
        )
      }
      />
    <button
      type="button"
      className="btn btn-danger"
      onClick={() => handleRemoveLink(sectionIndex, linkIndex)}
      >
x
    </button>
  </div>
      </>
))}

<button
  type="button"
  className="btn text-white bg-secondary "
  onClick={() => handleAddLink(sectionIndex)}
>
  Add Link
</button>

            
          </div>
          </>

        ))}
      </div>

      <div className="mb-4">
        <h5>Newsletter</h5>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Title"
          value={footerData.lastSection.newsletter.title}
          onChange={(e) => handleNewsletterChange("title", e.target.value)}
        />
        <textarea
          className="form-control"
          placeholder="Description"
          value={footerData.lastSection.newsletter.description}
          onChange={(e) =>
            handleNewsletterChange("description", e.target.value)
          }
        ></textarea>
      </div>

      <div className="mb-4">
      <h5>Copyright</h5>
        <input
          type="text"
          className="form-control"
          value={footerData.copyright}
          onChange={(e) =>
            setFooterData({ ...footerData, copyright: e.target.value })
          }
        />
      </div>
    </div>
  );
}

// "use client";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { checkPermission } from "../utills/Services";
// import { useNavigate } from "react-router";

// interface LinkItem {
//     label: string;
//     url: string;
//   }

//   interface Section {
//     name: string;
//     link: LinkItem[];
//   }

//   interface FooterData {
//     logoUrl: string;
//     socialLinks: { icon: string; url: string }[];
//     quickLinks: Section;
//     supermarketLinks: Section;
//     shelvingLinks: Section;
//     newsletter: {
//         title: string;
//         description: string;
//       };
//     copyright: string;
//   }

// interface SocialLink {
//   icon: string;
//   url: string;
// }

// export default function Footer() {
//  const navigate = useNavigate()

//   // Fetch footer data from API
//   useEffect(() => {

//         if (!checkPermission("User")) {
//              navigate("/404"); // Redirect to Page Not Found
//             }
//     const fetchFooterData = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}admin/api/footer`);

//         setFooterData(response.data.footer);
//       } catch (error) {
//         console.error("Error fetching footer data:", error);
//         // toast.error(error?.message);
//       }
//     };

//     fetchFooterData();
//   }, []);

//   const [footerData, setFooterData] = useState<FooterData>({
//     logoUrl: "",
//     socialLinks: [],
//     quickLinks: {
//       name: "",
//       link: [],
//     },
//     supermarketLinks: {
//       name: "",
//       link: [],
//     },
//     shelvingLinks: {
//       name: "",
//       link: [],
//     },
//     newsletter: {
//       title: "",
//       description: "",
//     },
//     copyright: "",
//   });

// // const [footerData, setFooterData] = useState<FooterData>(
// //   {
// //     logoUrl: "",
// //     socialLinks: [
// //       { icon: "/images/facebook.png", url: "https://facebook.com" },
// //       { icon: "/images/twitter.png", url: "https://twitter.com" },
// //     ],
// //     quickLinks: {
// //       name: "Quick Links",
// //       link: [
// //         { label: "Home", url: "/" },
// //         { label: "Shop", url: "/shop" },
// //       ],
// //     },
// //     supermarketLinks: {
// //       name: "Supermarkets",
// //       link: [
// //         { label: "Walmart", url: "https://www.walmart.com" },
// //         { label: "Costco", url: "https://www.costco.com" },
// //       ],
// //     },
// //     shelvingLinks: {
// //       name: "Shelving Market",
// //       link: [
// //         { label: "IKEA Shelving", url: "https://www.ikea.com" },
// //         { label: "Home Depot Shelving", url: "https://www.homedepot.com" },
// //       ],
// //     },
// //     newsletter: {
// //       title: "Subscribe to Our Newsletter",
// //       description: "Stay updated with our latest products, offers, and news.",
// //     },
// //     copyright: `© ${new Date().getFullYear()} MyEcommerce. All Rights Reserved.`,
// //   }
// //   );

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, key: keyof typeof footerData) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setFooterData((prev) => ({ ...prev, [key]: imageUrl }));
//     }
//   };

//   const handleTitleChange = (key: keyof FooterData, value: string) => {
//     setFooterData((prev) => ({
//       ...prev,
//       [key]: { ...prev[key] as Section, title: value },
//     }));
//   };

//   const handleLinkChange = (
//     key: keyof FooterData,
//     index: number,
//     field: keyof LinkItem,
//     value: string
//   ) => {
//     setFooterData((prev) => {
//       const updatedLinks = [...(prev[key] as Section).link];
//       updatedLinks[index] = { ...updatedLinks[index], [field]: value };
//       return { ...prev, [key]: { ...prev[key] as Section, links: updatedLinks } };
//     });
//   };

//   const addLink = (key: keyof FooterData) => {
//     setFooterData((prev) => ({
//       ...prev,
//       [key]: {
//         ...prev[key] as Section,
//         link: [...(prev[key] as Section)?.link, { label: "", url: "" }],
//       },
//     }));
//   };

//   const removeLink = (key: keyof FooterData, index: number) => {
//     setFooterData((prev) => {
//       const updatedLinks = (prev[key] as Section).link.filter((_, i) => i !== index);
//       return { ...prev, [key]: { ...prev[key] as Section, links: updatedLinks } };
//     });
//   };

//   const handleSocialChange = (index: number, key: keyof SocialLink, value: string) => {
//     setFooterData((prev) => {
//       const updatedSocialLinks = [...prev.socialLinks];
//       updatedSocialLinks[index][key] = value;
//       return { ...prev, socialLinks: updatedSocialLinks };
//     });
//   };
//   const removeSocialLink = (index: number) => {
//     setFooterData((prev) => ({
//       ...prev,
//       socialLinks: prev.socialLinks.filter((_, i) => i !== index),
//     }));
//   };

//   const addSocialLink = () => {
//     setFooterData((prev) => ({
//       ...prev,
//       socialLinks: [...prev.socialLinks, { icon: "", url: "" }],
//     }));
//   };

//     const handleSave = () => {

//       toast.success("Operation successful! 🎉");
//     };

//   return (
//     <>
//     <footer className=" text-light py-4">
//            {/* Save Button */}

//       <div className="container">
//    <div className="d-flex justify-content-end">

//     <button className="btn btn-dark mb-3" onClick={()=>handleSave()}>
//        Save
//      </button>
//     </div>
//         <div className="text-dark">

//    Footer Top
// </div>
//         <div className="row text-center text-md-start border-1  p-2 rounded">
//           <div className="col-md-6 mb-3 text-dark"> Upload Logo
//             <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logoUrl")} />
//             {footerData.logoUrl && <img src={footerData.logoUrl} alt="Logo" width={150} height={50} />}
//           </div>

//           <div className="col-md-6 d-flex flex-column">
//             {footerData?.socialLinks?.map((link, index) => (
//               <div key={index} className="d-flex align-items-center mb-2 ">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleSocialChange(index, "icon", URL.createObjectURL(e.target.files?.[0]!))}
//                 />
//                 {link.icon && <img src={link.icon} alt="Social Icon" width={30} height={30} />}
//                 <input
//                   type="text"
//                   placeholder="Social Media URL"
//                   value={link.url}
//                   onChange={(e) => handleSocialChange(index, "url", e.target.value)}
//                   className="form-control mx-2"
//                 />
//                 <button onClick={() => removeSocialLink(index)} className="btn btn-danger">
//                   {/* <FaTrash /> */}        &times;
//                 </button>
//               </div>
//             ))}
//             <button onClick={addSocialLink} className="btn btn-dark">
//             Add Social Link
//             </button>
//           </div>
//         </div>
//         <hr className="bg-light" />

// {/* Dynamic Links Sections */}
//  {(["quickLinks", "supermarketLinks", "shelvingLinks"] as (keyof FooterData)[])?.map((key, i) => (
//   <div key={key} className="row mb-3 border-1 p-2 rounded">
//     <div className="text-dark">
//       Section {i + 1}
//     </div>
//     <div className="col-md-6">
//       <input
//         type="text"
//         className="form-control mb-2"
//         value={(footerData[key] as Section)?.name}
//         onChange={(e) => handleTitleChange(key, e.target.value)}
//       />
//       {(footerData[key] as Section)?.link?.map((lin, index) => (
//         <div key={index} className="d-flex align-items-center mb-2">
//           <input
//             type="text"
//             placeholder="Label"
//             value={lin.label}
//             onChange={(e) => handleLinkChange(key, index, "label", e.target.value)}
//             className="form-control me-2"
//           />
//           <input
//             type="text"
//             placeholder="URL"
//             value={lin.url}
//             onChange={(e) => handleLinkChange(key, index, "url", e.target.value)}
//             className="form-control me-2"
//           />
//           <button onClick={() => removeLink(key, index)} className="btn btn-danger">
//             &times;
//           </button>
//         </div>
//       ))}
//       <button onClick={() => addLink(key)} className="btn btn-dark">
//         Add Link
//       </button>
//     </div>
//   </div>
// ))}

// {/* Subscribe to Our Newsletter Section */}
// <div className="row mb-3 border-1 p-2 rounded">
//   <div className="text-dark">
//     Section 4
//   </div>
//   <div className="col-md-6">
//     {/* Newsletter Title */}
//     <input
//       type="text"
//       className="form-control mb-2"
//       value={footerData?.newsletter?.title}
//       onChange={(e) =>
//         setFooterData((prev) => ({
//           ...prev,
//           newsletter: { ...prev.newsletter, title: e.target.value },
//         }))
//       }
//     />
//     {/* Newsletter Description */}
//     <textarea
//       className="form-control mb-2"
//       rows={3}
//       value={footerData?.newsletter?.description}
//       onChange={(e) =>
//         setFooterData((prev) => ({
//           ...prev,
//           newsletter: { ...prev.newsletter, description: e.target.value },
//         }))
//       }
//     />
//   </div>
// </div>

//         <hr className="bg-light" />
//         <div className="text-dark">

// Footer Bottom
// </div>
//         <div className="text-center border-1  p-2 rounded">
//           <input
//             type="text"
//             className="form-control mb-2"
//             value={footerData.copyright}
//             onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
//           />
//         </div>
//       </div>
//     </footer>

//     </>

//   );
// }
