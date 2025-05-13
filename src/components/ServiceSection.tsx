'use client';
import React, { useEffect, useState, FormEvent } from 'react';
import api from '../utills/api';
import { toast } from 'react-toastify';

interface Service {
  serviceName: string;
  serviceDescription: string;
  serviceImage: File | null;
  preview?: string;
}

interface Errors {
  heading?: string;
  subHeading?: string;
  [key: string]: any;
}

const ServiceSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    { serviceName: '', serviceDescription: '', serviceImage: null },
  ]);
  const [servicesHeading, setServicesHeading] = useState<string>('');
  const [servicesSubHeading, setServicesSubHeading] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('admin/api/cms-service');
        const { heading, subHeading, service: fetchedServices } = response.data.ServiceSection;

        setServicesHeading(heading || '');
        setServicesSubHeading(subHeading || '');

        setServices(
          fetchedServices.map((service: any) => ({
            serviceName: service.serviceName || '',
            serviceDescription: service.serviceDescription || '',
            serviceImage: null,
            preview: service.serviceImage || '',
          }))
        );
      } catch (error) {
        console.error('Error fetching services data:', error);
        toast.error('Failed to load services');
      }
    };
    fetchData();
  }, []);

  const onServiceChange = (index: number, field: string, value: any) => {
    const updated = [...services];
    (updated[index] as any)[field] = value;
    setServices(updated);
  };

  const handleServiceImageChange = (index: number, file: File) => {
    const updated = [...services];
    updated[index].serviceImage = file;
    updated[index].preview = URL.createObjectURL(file);
    setServices(updated);
  };

  const onAddService = () => {
    setServices([...services, { serviceName: '', serviceDescription: '', serviceImage: null }]);
  };

  const onRemoveService = (index: number) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (!servicesHeading.trim()) {
      newErrors.heading = 'Heading is required';
    }
    if (!servicesSubHeading.trim()) {
      newErrors.subHeading = 'Subheading is required';
    }

    services.forEach((s, idx) => {
      const err: any = {};
      if (!s.serviceName.trim()) err.serviceName = 'Service name is required';
      if (!s.serviceDescription.trim()) err.serviceDescription = 'Service description is required';
      if (!s.preview && !s.serviceImage) err.serviceImage = 'Service image is required';

      if (Object.keys(err).length > 0) newErrors[`service_${idx}`] = err;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleServiceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const updatedServices = await Promise.all(
        services.map(async (s) => {
          let imageBase64 = s.preview || '';
          if (s.serviceImage) {
            imageBase64 = await convertToBase64(s.serviceImage);
          }
          return {
            serviceName: s.serviceName,
            serviceDescription: s.serviceDescription,
            serviceImage: imageBase64,
          };
        })
      );

      const payload = {
        heading: servicesHeading,
        subHeading: servicesSubHeading,
        service: updatedServices,
      };

      const response = await api.put('admin/api/cms-service/update', payload);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Service save error:', error);
      toast.error('Failed to save services');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">Services Section</h2>

      <form onSubmit={handleServiceSubmit} className="space-y-4">
        {/* Heading */}
        <div>
          <label className="block text-sm font-medium">Heading</label>
          <input
            type="text"
            value={servicesHeading}
            onChange={(e) => setServicesHeading(e.target.value)}
            className={`mt-1 block w-full border rounded px-3 py-2 ${
              errors.heading ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.heading && <p className="text-red-500 text-sm mt-1">{errors.heading}</p>}
        </div>

        {/* Sub Heading */}
        <div>
          <label className="block text-sm font-medium">Sub Heading</label>
          <input
            type="text"
            value={servicesSubHeading}
            onChange={(e) => setServicesSubHeading(e.target.value)}
            className={`mt-1 block w-full border rounded px-3 py-2 ${
              errors.subHeading ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.subHeading && <p className="text-red-500 text-sm mt-1">{errors.subHeading}</p>}
        </div>

        {/* Services */}
        {services.map((service, index) => {
          const serviceError = errors[`service_${index}`] || {};
          return (
            <div key={index} className="border p-4 rounded mb-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Service {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => onRemoveService(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>

              <div className="mt-2">
                <label className="block text-sm font-medium">Service Name</label>
                <input
                  type="text"
                  value={service.serviceName}
                  onChange={(e) => onServiceChange(index, 'serviceName', e.target.value)}
                  className={`mt-1 block w-full border rounded px-3 py-2 ${
                    serviceError.serviceName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {serviceError.serviceName && (
                  <p className="text-red-500 text-sm mt-1">{serviceError.serviceName}</p>
                )}
              </div>

              <div className="mt-2">
                <label className="block text-sm font-medium">Service Description</label>
                <textarea
                  value={service.serviceDescription}
                  onChange={(e) => onServiceChange(index, 'serviceDescription', e.target.value)}
                  rows={2}
                  className={`mt-1 block w-full border rounded px-3 py-2 ${
                    serviceError.serviceDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {serviceError.serviceDescription && (
                  <p className="text-red-500 text-sm mt-1">{serviceError.serviceDescription}</p>
                )}
              </div>

              <div className="mt-2">
                <label className="block text-sm font-medium">Service Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleServiceImageChange(index, file);
                  }}
                  className={`mt-1 block w-full ${
                    serviceError.serviceImage ? 'border-red-500 border' : ''
                  }`}
                />
                {serviceError.serviceImage && (
                  <p className="text-red-500 text-sm mt-1">{serviceError.serviceImage}</p>
                )}
                {service.preview && (
                  <img
                    src={service.preview}
                    alt="preview"
                    className="mt-2 h-32 object-cover rounded"
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Buttons */}
        <button
          type="button"
          onClick={onAddService}
          className="bg-secondary text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Service
        </button>

        <button
          type="submit"
          className="bg-dark text-white px-4 py-2 rounded hover:bg-blue-700 ml-4"
        >
          Save Services
        </button>
      </form>
    </div>
  );
};

export default ServiceSection;


// import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
// import api from '../utills/api';
// import { toast } from 'react-toastify';

// interface Service {
//   serviceName: string;
//   serviceDescription: string;
//   serviceImage: File | null;
//   preview?: string;
// }

// interface Props {

// }

// const ServiceSection: React.FC<Props> = ({

// }) => {
//   const [services, setServices] = useState<Service[]>([
//     { serviceName: '', serviceDescription: '', serviceImage: null },
//   ]);
//   const [servicesHeading, setServicesHeading] = useState<string>('');
//   const [servicesSubHeading, setServicesSubHeading] = useState<string>('');


//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const response = await api.get('admin/api/cms-service');
          
//           const { heading, subHeading, service: fetchedServices } = response.data.ServiceSection;
          
//           setServicesHeading(heading);
//           setServicesSubHeading(subHeading);
    
//           setServices(
//             fetchedServices.map((service: any) => ({
//               serviceName: service.serviceName || '',
//               serviceDescription: service.serviceDescription || '',
//               serviceImage: null,
//               preview: service.serviceImage || '',
//             }))
//           );
//         } catch (error) {
//           console.error('Error fetching services data:', error);
//           alert('Failed to load services');
//         }
//       };    
//       fetchData();
//     }, []);
    


//   // 🧩 Services Section Logic
//   const onServiceChange = (index: number, field: string, value: any) => {
//     const updated = [...services];
//     (updated[index] as any)[field] = value;
//     setServices(updated);
//   };
  
//   const handleServiceImageChange = (index: number, file: File) => {
//     const updated = [...services];
//     updated[index].serviceImage = file;
//     updated[index].preview = URL.createObjectURL(file);
//     setServices(updated);
//   };
//   const onAddService = () => {
//     setServices([
//       ...services,
//       { serviceName: '', serviceDescription: '', serviceImage: null },
//     ]);
//   };
//   const onRemoveService = (index: number) => {
//     const updated = [...services];
//     updated.splice(index, 1);
//     setServices(updated);
//   };



//   const convertToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });
//   };
  
//   const handleServiceSubmit = async (e: FormEvent) => {
//     e.preventDefault();
  
//     try {
//       const updatedServices = await Promise.all(
//         services.map(async (service) => {
//           let imageBase64 = service.preview || '';
//           if (service.serviceImage) {
//             imageBase64 = await convertToBase64(service.serviceImage);
//           }
  
//           return {
//             serviceName: service.serviceName,
//             serviceDescription: service.serviceDescription,
//             serviceImage: imageBase64,
//           };
//         })
//       );
  
//       const payload = {
//         heading: servicesHeading,
//         subHeading: servicesSubHeading,
//         service: updatedServices,
//       };
  
//       const response = await api.put('admin/api/cms-service/update', payload);
//       toast.success(response.data.message);
//     } catch (error) {
//       console.error('Service save error:', error);
//       toast.error('Failed to save services');
//     }
//   };
  
//   // const handleServiceSubmit = async (e: FormEvent) => {
//   //   e.preventDefault();



//   //   try {
      
//   //     const response = await api.put('admin/api/cms-service/update', {heading:servicesHeading,subHeading:servicesSubHeading,service:services});
//   //     toast.success(response.data.message);
//   //   } catch (error) {
//   //     console.error('Service save error:', error);
//   //     toast.error('Failed to save services');
//   //   }
//   // };


//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded mt-10">
//       <h2 className="text-2xl font-bold mb-4">Services Section</h2>

//       <form onSubmit={handleServiceSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Heading</label>
//           <input
//             type="text"
//             value={servicesHeading}
//             onChange={(e) => setServicesHeading(e.target.value)}
//                         className="mt-1 block w-full border rounded px-3 py-2"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Sub Heading</label>
//           <input
//             type="text"
//             value={servicesSubHeading}
//             onChange={(e) => setServicesSubHeading(e.target.value)}
//             className="mt-1 block w-full border rounded px-3 py-2"
//           />
//         </div>

//         {services.map((service, index) => (
//           <div key={index} className="border p-4 rounded mb-4">
//             <div className="flex justify-between items-center">
//               <h3 className="font-semibold text-lg">Service {index + 1}</h3>
//               {index >= 0 && (
//                 <button type="button" onClick={() => onRemoveService(index)} className="text-red-500">
//                   Remove
//                 </button>
//               )}
//             </div>

//             <div className="mt-2">
//               <label className="block text-sm font-medium">Service Name</label>
//               <input
//                 required
//                 type="text"
//                 value={service.serviceName}
//                 onChange={(e) => onServiceChange(index, 'serviceName', e.target.value)}
//                 className="mt-1 block w-full border rounded px-3 py-2"
//               />
//             </div>

//             <div className="mt-2">
//               <label className="block text-sm font-medium">Service Description</label>
//               <textarea
//                 required
//                 value={service.serviceDescription}
//                 onChange={(e) => onServiceChange(index, 'serviceDescription', e.target.value)}
//                 rows={2}
//                 className="mt-1 block w-full border rounded px-3 py-2"
//               />
//             </div>

//             <div className="mt-2">
//               <label className="block text-sm font-medium">Service Image</label>
//               <input
//               required
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) handleServiceImageChange(index, file);
//                 }}
//                 className="mt-1 block w-full"
//               />
//               {service.preview && (
//                 <img src={service.preview} alt="preview" className="mt-2 h-32 object-cover rounded" />
//               )}
//             </div>
//           </div>
//         ))}

//         <button
//           type="button"
//           onClick={onAddService}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Add Service
//         </button>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-4"
//         >
//           Save Services
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ServiceSection;
