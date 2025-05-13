import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import api from "../../utills/api";
import { toast } from "react-toastify";
import ServiceSection from "../../components/ServiceSection";
import CatalogueSection from "../../components/CatalogueSection";

interface HomePageCMSFormData {
  _id: string;
  heading: string;
  backgroundImage: File | null | string;
  subHeading: string;
  metaTitle: string;
  metaDescription: string;
}

interface FormErrors {
  heading?: string;
  subHeading?: string;
  metaTitle?: string;
  metaDescription?: string;
  backgroundImage?: string;
}

const HomeCMS: React.FC = () => {
  const [formData, setFormData] = useState<HomePageCMSFormData>({
    _id: "",
    backgroundImage: null,
    heading: "",
    subHeading: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchCMSData = async () => {
      try {
        const response = await api.get("admin/api/cms-home");
        const data = response.data.home;

        setFormData({
          _id: data.heroSection._id,
          backgroundImage: data.heroSection.backgroundImage,
          heading: data.heroSection.heading || "",
          subHeading: data.heroSection.subHeading || "",
          metaTitle: data.heroSection.metaTitle || "",
          metaDescription: data.heroSection.metaDescription || "",
        });

        setPreviewImage(data.heroSection.backgroundImage);
      } catch (error) {
        console.error("Failed to fetch CMS data", error);
      }
    };

    fetchCMSData();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "backgroundImage" && e.target instanceof HTMLInputElement) {
      const file = e.target.files?.[0];
      if (file) {
        setPreviewImage(URL.createObjectURL(file));
        setFormData((prev: any) => ({ ...prev, backgroundImage: file }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.heading.trim()) newErrors.heading = "Heading is required";
    if (!formData.subHeading.trim())
      newErrors.subHeading = "Sub-heading is required";
    if (!formData.metaTitle.trim())
      newErrors.metaTitle = "Meta title is required";
    if (!formData.metaDescription.trim())
      newErrors.metaDescription = "Meta description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      let base64Image = formData.backgroundImage;

      if (formData.backgroundImage instanceof File) {
        base64Image = await convertToBase64(formData.backgroundImage);
      }

      const payload = {
        heading: formData.heading,
        subHeading: formData.subHeading,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        backgroundImage: base64Image,
      };

      const response = await api.put(
        `admin/api/cms-home/update/${formData._id}`,
        payload
      );

      toast.success(response.data.message);
    } catch (error) {
      console.error("Save error:", error);
  
    }
  };

  return (
    <div className="table-responsive space-y-10">
      <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Hero Section</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Background Image</label>
            <input
              type="file"
              name="backgroundImage"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full"
            />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="mt-2 w-full max-h-48 rounded border" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Heading</label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              placeholder="Heading"
              className="w-full border px-3 py-2 rounded"
            />
            {errors.heading && <p className="text-red-600 text-sm">{errors.heading}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Sub-heading</label>
            <input
              type="text"
              name="subHeading"
              value={formData.subHeading}
              onChange={handleChange}
              placeholder="Sub Heading"
              className="w-full border px-3 py-2 rounded"
            />
            {errors.subHeading && <p className="text-red-600 text-sm">{errors.subHeading}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              placeholder="Meta Title"
              className="w-full border px-3 py-2 rounded"
            />
            {errors.metaTitle && <p className="text-red-600 text-sm">{errors.metaTitle}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              placeholder="Meta Description"
              rows={3}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.metaDescription && (
              <p className="text-red-600 text-sm">{errors.metaDescription}</p>
            )}
          </div>

          <button type="submit" className="bg-dark text-white px-4 py-2 rounded hover:bg-blue-700">
            Update
          </button>
        </form>
      </div>

      <ServiceSection />
      <CatalogueSection />
    </div>
  );
};

export default HomeCMS;
