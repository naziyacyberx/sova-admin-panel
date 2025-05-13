
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Blank from "./pages/Blank";
import Calendar from "./pages/Calendar";
import Ecommerce from "./pages/Dashboard/ECommerce";
import FormElements from "./pages/Forms/FormElements";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import UserProfiles from "./pages/UserProfiles";
import Header from "./pages/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Users from "./pages/Users/Users";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Customers from "./pages/Customers/Customers";
import Roles from "./pages/Roles/Roles";
import Contact from "./pages/Contact/Contact";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import HomeCMS from "./pages/HomeCms/HomeCms";
import CMSPageManager from "./pages/CmsPageManager/CmsPageManager";
import FAQSection from "./pages/Faq/Faq";
import Faq from "./pages/Faq/Faq";

export default function App() {
  return (
    <>
      <Router>
        <ToastContainer autoClose={3000} className="toaster" style={{ zIndex: 999999 }} />
        <Routes>
          {/* Public Routes - Auth Pages */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Protected Routes using PrivateRoute */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Ecommerce />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/header" element={<Header />} />
              <Route path="/footer" element={<Footer />} />
              <Route path="/users" element={<Users />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badges" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/cms-home" element={<HomeCMS />} /> 
              <Route path="/cms-page-manager" element={<CMSPageManager />} /> 
              <Route path="/faq" element={<Faq />} /> 
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

