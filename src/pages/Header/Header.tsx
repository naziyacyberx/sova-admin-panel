import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import HeaderTop from "../../components/HeaderTop";
import HeaderMain from "../../components/HeaderMain";
import { toast } from "react-toastify";
import api from "../../utills/api";
import { GET_HEADER_CONTENT } from "../../utills/endpoint";
import { checkPermission } from "../../utills/Services";
import { useNavigate } from "react-router";



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

interface HeaderData {
  title: string;
  logo: string | null;
  navLinks: NavLink[];
  socialIcons: SocialIcon[];
  selectedLanguage: string;
}

export default function HeaderSettings() {
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false)
  const [headerData, setHeaderData] = useState<HeaderData>({
    title: "E-commerce Admin Panel",
    logo: null,
    navLinks: [ { name: "Home", url: "", _id: "123" }],
    // ["Home", "Products", "Orders", "Customers"],
    socialIcons: [
      { name: "Facebook", url: "", icon: null },
      { name: "Twitter", url: "", icon: null },
      { name: "Instagram", url: "", icon: null },
    ],
    selectedLanguage: "English",
  });

const getData = async () =>{
  try{

    const response = await api.get(GET_HEADER_CONTENT);
    // const response = await fetchHandler(GET_HEADER_CONTENT, "", true, setLoader, "GET")
    setHeaderData(response?.data?.header[0])
    
  } catch(error){
           console.log("Error",error);           
  }
  
}
   useEffect(()=>{
        if (!checkPermission("User")) {
             navigate("/404"); // Redirect to Page Not Found
            }
               getData();
   },[])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>  {
    const { name, value } = e.target;
    setHeaderData({ ...headerData, [name]: value });
  };

  // const handleNavLinkChange = (index: number, value: string) => {
    // const updatedLinks = [...headerData.navLinks];
    // updatedLinks[index] = value;
    // setHeaderData({ ...headerData, navLinks: updatedLinks });
  // };
  const handleNavLinkChange = (index: number, field: keyof NavLink, value: string) => {
    const updatedLinks = [...headerData.navLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setHeaderData({ ...headerData, navLinks: updatedLinks });
  };
  

  const handleAddNavLink = () => {
    setHeaderData({
      ...headerData,
      navLinks: [...headerData.navLinks, { name: "", url: "", _id: null }],
    });
  };
  

  const handleRemoveNavLink = (index: number) => {
    const updatedLinks = headerData.navLinks.filter((_, i) => i !== index);
    setHeaderData({ ...headerData, navLinks: updatedLinks });
  };

  // const handleSocialChange = (index: number, field: keyof SocialIcon, value: string) => {
  //   const updatedIcons = [...headerData.socialIcons];
  //   updatedIcons[index] = { ...updatedIcons[index], [field]: value };
  //   setHeaderData({ ...headerData, socialIcons: updatedIcons });
  // };

  const handleSocialChange = (index: number, field: keyof SocialIcon, value: string) => {
    const updatedIcons = [...headerData.socialIcons];
  
    if (field === "url") {
      // Extract the platform name based on the URL
      const platformNames: { [key: string]: string } = {
        facebook: "Facebook",
        twitter: "Twitter",
        instagram: "Instagram",
        linkedin: "LinkedIn",
        youtube: "YouTube",
      };
  
      let newName = updatedIcons[index].name; // Default to existing name
  
      // Check if the URL contains any known social media names
      Object.keys(platformNames).forEach((key) => {
        if (value.toLowerCase().includes(key)) {
          newName = platformNames[key];
        }
      });
  
      updatedIcons[index] = { ...updatedIcons[index], url: value, name: newName };
    } else {
      updatedIcons[index] = { ...updatedIcons[index], [field]: value };
    }
  
    setHeaderData({ ...headerData, socialIcons: updatedIcons });
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "social", index?: number) => {
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "social", index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "social") {
          setHeaderData({ ...headerData, logo: reader.result as string });
        } else if (index !== undefined) {
          handleSocialChange(index, "icon", reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSocialIcon = () => {
    setHeaderData({
      ...headerData,
      socialIcons: [...headerData.socialIcons, { name: "", url: "", icon: null }],
    });
  };
  
  const handleRemoveSocialIcon = (index: number) => {
    const updatedIcons = headerData.socialIcons.filter((_, i) => i !== index);
    setHeaderData({ ...headerData, socialIcons: updatedIcons });
  };


  const handleSave = async () => {
    try {
      setLoader(true);
  
      const payload = {
        ...headerData,
        // Optionally sanitize or format if needed
        selectedLanguage: headerData.selectedLanguage.toLowerCase(), // convert to 'en', 'fr', etc.
      };
  
      const response = await api.post(
        "https://sova-admin.cyberxinfosolution.com/admin/api/header/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      toast.success(response.data.message);
      // toast.success("Header settings updated successfully! 🎉");
    } catch (error: any) {
      toast.error("Failed to update header settings.");
      console.error("Error updating header:", error);
    } finally {
      setLoader(false);
    }
  };
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");

    
  // const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setSelectedLanguage(e.target.value);
    // Your existing logic
  };
  
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Update Header Settings </h2>

{/*  add here save btn */}
   {/* Save Button */}
   <div className="d-flex justify-content-end">
    
   <button className="btn btn-dark  mb-3" onClick={handleSave}>
      Save
    </button>
   </div>

      <HeaderTop
  {...headerData}
  handleChange={handleChange}
  handleFileChange={handleFileChange}
  handleSocialChange={handleSocialChange}
  handleAddSocialIcon={handleAddSocialIcon}
  handleRemoveSocialIcon={handleRemoveSocialIcon}
  handleLanguageChange={handleLanguageChange}
  // selectedLanguage={selectedLanguage}
/>
   <HeaderMain {...headerData} handleChange={handleChange} handleFileChange={handleFileChange} handleNavLinkChange={handleNavLinkChange} handleAddNavLink={handleAddNavLink} handleRemoveNavLink={handleRemoveNavLink} />
    </div>
  );
}
