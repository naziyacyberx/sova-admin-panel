import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import api from '../utills/api';


interface Catalogue {
  catalogueName: string;
  catalogueDescription: string;
  catalogueImage: File | null;
  preview?: string;
}

const CatalogueSection: React.FC = () => {
  const [errors, setErrors] = useState<any>({});
  const [catalogues, setCatalogues] = useState<Catalogue[]>([
    { catalogueName: '', catalogueDescription: '', catalogueImage: null },
  ]);
  const [cataloguesHeading, setCataloguesHeading] = useState<string>('');
  const [cataloguesSubHeading, setCataloguesSubHeading] = useState<string>('');

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('admin/api/cms-catalogue');
        const { heading, subHeading, catalogue: fetchedCatalogues } = response.data.CatalogueSection;

        setCataloguesHeading(heading);
        setCataloguesSubHeading(subHeading);

        setCatalogues(
          fetchedCatalogues.map((catalogue: any) => ({
            catalogueName: catalogue.catalogueName || '',
            catalogueDescription: catalogue.catalogueDescription || '',
            catalogueImage: null,
            preview: catalogue.catalogueImage || '',
          }))
        );
      } catch (error) {
        console.error('Error fetching catalogue data:', error);
        alert('Failed to load catalogues');
      }
    };
    fetchData();
  }, []);

  const onCatalogueChange = (index: number, field: string, value: any) => {
    const updated = [...catalogues];
    (updated[index] as any)[field] = value;
    setCatalogues(updated);
  };

  const handleCatalogueImageChange = (index: number, file: File) => {
    const updated = [...catalogues];
    updated[index].catalogueImage = file;
    updated[index].preview = URL.createObjectURL(file);
    setCatalogues(updated);
  };

  const onAddCatalogue = () => {
    setCatalogues([
      ...catalogues,
      { catalogueName: '', catalogueDescription: '', catalogueImage: null },
    ]);
  };

  const onRemoveCatalogue = (index: number) => {
    const updated = [...catalogues];
    updated.splice(index, 1);
    setCatalogues(updated);
  };

  // const handleCatalogueSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  
  //   try {
  //     // Convert image files to Base64
  //     const processedCatalogues = await Promise.all(
  //       catalogues.map(async (cat) => {
  //         if (cat.catalogueImage) {
  //           const base64 = await convertToBase64(cat.catalogueImage);
  //           return {
  //             ...cat,
  //             catalogueImage: base64, // now a string
  //           };
  //         } else {
  //           return {
  //             ...cat,
  //             catalogueImage: cat.preview || '', // keep preview URL if no new file selected
  //           };
  //         }
  //       })
  //     );
  
  //     const response = await api.put('admin/api/cms-catalogue/update', {
  //       heading: cataloguesHeading,
  //       subHeading: cataloguesSubHeading,
  //       catalogue: processedCatalogues,
  //     });
  
  //     toast.success(response.data.message);
  //   } catch (error) {
  //     console.error('Catalogue save error:', error);
  //     toast.error('Failed to save catalogues');
  //   }
  // };
  const handleCatalogueSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    const newErrors: any = {};
    if (!cataloguesHeading.trim()) newErrors.cataloguesHeading = 'Heading is required';
    if (!cataloguesSubHeading.trim()) newErrors.cataloguesSubHeading = 'Sub Heading is required';
  
    catalogues.forEach((cat, i) => {
      if (!cat.catalogueName.trim()) newErrors[`catalogueName_${i}`] = 'Catalogue name is required';
      if (!cat.catalogueDescription.trim()) newErrors[`catalogueDescription_${i}`] = 'Catalogue description is required';
      if (!cat.catalogueImage && !cat.preview) newErrors[`catalogueImage_${i}`] = 'Catalogue image is required';
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setErrors({}); // Clear previous errors
  
    try {
      const processedCatalogues = await Promise.all(
        catalogues.map(async (cat) => {
          if (cat.catalogueImage) {
            const base64 = await convertToBase64(cat.catalogueImage);
            return { ...cat, catalogueImage: base64 };
          } else {
            return { ...cat, catalogueImage: cat.preview || '' };
          }
        })
      );
  
      const response = await api.put('admin/api/cms-catalogue/update', {
        heading: cataloguesHeading,
        subHeading: cataloguesSubHeading,
        catalogue: processedCatalogues,
      });
  
      toast.success(response.data.message);
    } catch (error) {
      console.error('Catalogue save error:', error);
      toast.error('Failed to save catalogues');
    }
  };
  
  // const handleCatalogueSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await api.put('admin/api/cms-catalogue/update', {
  //       heading: cataloguesHeading,
  //       subHeading: cataloguesSubHeading,
  //       catalogue: catalogues,
  //     });
  //     toast.success(response.data.message);
  //   } catch (error) {
  //     console.error('Catalogue save error:', error);
  //     toast.error('Failed to save catalogues');
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">Catalogue Section</h2>

      <form onSubmit={handleCatalogueSubmit} className="space-y-4">
    {/* Heading */}
<div>
  <label className="block text-sm font-medium">Heading</label>
  <input
    type="text"
    value={cataloguesHeading}
    onChange={(e) => setCataloguesHeading(e.target.value)}
    className="mt-1 block w-full border rounded px-3 py-2"
  />
  {errors.cataloguesHeading && <p className="text-red-500 text-sm mt-1">{errors.cataloguesHeading}</p>}
</div>

{/* Sub Heading */}
<div>
  <label className="block text-sm font-medium">Sub Heading</label>
  <input
    type="text"
    value={cataloguesSubHeading}
    onChange={(e) => setCataloguesSubHeading(e.target.value)}
    className="mt-1 block w-full border rounded px-3 py-2"
  />
  {errors.cataloguesSubHeading && <p className="text-red-500 text-sm mt-1">{errors.cataloguesSubHeading}</p>}
</div>


        {catalogues.map((catalogue, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Catalogue {index + 1}</h3>
              <button type="button" onClick={() => onRemoveCatalogue(index)} className="text-red-500">
                Remove
              </button>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium">Catalogue Name</label>
              <input
  type="text"
  value={catalogue.catalogueName}
  onChange={(e) => onCatalogueChange(index, 'catalogueName', e.target.value)}
  className="mt-1 block w-full border rounded px-3 py-2"
/>
{errors[`catalogueName_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`catalogueName_${index}`]}</p>}

            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium">Catalogue Description</label>
              <textarea
  value={catalogue.catalogueDescription}
  onChange={(e) => onCatalogueChange(index, 'catalogueDescription', e.target.value)}
  rows={2}
  className="mt-1 block w-full border rounded px-3 py-2"
/>
{errors[`catalogueDescription_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`catalogueDescription_${index}`]}</p>}

            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium">Catalogue Image</label>
              <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleCatalogueImageChange(index, file);
  }}
  className="mt-1 block w-full"
/>
{errors[`catalogueImage_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`catalogueImage_${index}`]}</p>}
              {catalogue.preview && (
                <img src={catalogue.preview} alt="preview" className="mt-2 h-32 object-cover rounded" />
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddCatalogue}
          className="bg-secondary text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Catalogue
        </button>

        <button
          type="submit"
          className="bg-dark text-white px-4 py-2 rounded hover:bg-blue-700 ml-4"
        >
          Save Catalogues
        </button>
      </form>
    </div>
  );
};

export default CatalogueSection;
