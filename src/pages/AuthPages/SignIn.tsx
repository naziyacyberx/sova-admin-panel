import { useState } from "react";
import GridShape from "../../components/common/GridShape";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import { toast } from "react-toastify";
// import { fetchHandler } from "../../utills/api";
import { SIGN_IN } from "../../utills/endpoint";
import api from "../../utills/api";

export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: any) => {
    event.preventDefault();
    try {
      const response = await api.post(SIGN_IN, { email, password });
      // const response = await fetchHandler( SIGN_IN, { email, password },true,setLoader,"POST");
      // axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`,{email,password})

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="relative flex w-full h-screen px-4 py-6 overflow-hidden bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
          <div className="w-full max-w-md pt-10 mx-auto d-none">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeftIcon />
              Back to dashboard
            </Link>
          </div>
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Sign In
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to sign in!
                </p>
              </div>
              <div>
                <div className="relative py-3 sm:py-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    {/* <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                      Or
                    </span> */}
                  </div>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Email <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                      required
                        placeholder="info@gmail.com"
                        onChange={(event) => {
                          setEmail(event.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <Label>
                        Password <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative">
                        <Input
                        required
                          type={showPassword ? "text" : "password"}
                          onChange={(event) => {
                            setPassword(event.target.value);
                          }}
                          placeholder="Enter your password"
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Button className="w-full" size="sm">
                        Sign in
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative items-center justify-center flex-1 hidden p-8 z-1 bg-black dark:bg-white/5 lg:flex">
          {/* <!-- ===== Common Grid Shape Start ===== --> */}
          <GridShape />
          <div className="flex flex-col items-center max-w-xs">
            <Link to="/" className="block mb-4">
              <img src="./images/logo/logo.png" alt="Logo" />
            </Link>
            <p className="text-center text-gray-400 dark:text-white/60">
              3D Web Experiences
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
