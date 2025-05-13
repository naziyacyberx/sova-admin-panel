export const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };


  export const checkPermission = (pageName) => {
    if (typeof window !== "undefined") {
      const storedPermissions = JSON.parse(localStorage.getItem("permissions") || "[]");
      
      const hasViewPermission = storedPermissions.some(
        (perm) => perm.page === pageName && perm.actions.includes("view")
      );
  
      return hasViewPermission;
    }
    return false;
  };

  export const getPagePermissions = (pageName) => {
    if (typeof window !== "undefined") {
      const storedPermissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  
      const pagePermission = storedPermissions.find(
        (perm) => perm.page.toLowerCase() === pageName.toLowerCase()
      );
  
      return {
        canView: pagePermission?.actions.includes("view") || false,
        canCreate: pagePermission?.actions.includes("create") || false,
        canEdit: pagePermission?.actions.includes("edit") || false,
        canDelete: pagePermission?.actions.includes("delete") || false,
      };
    }
    return { canView: false, canCreate: false, canEdit: false, canDelete: false };
  };
  