import React from "react";
import { useState, useEffect } from "react";
// Assuming paths are correct for the environment
import CommonForm from "@/components/common/form"; 
import { registerFormControls } from "@/config"; // May not be needed in login file, but kept for context
import { loginFormControls } from "@/config";
import { LoginUser } from "../../store/auth-slice/index"; // Assuming Redux setup
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  email: '',
  password: '',
}

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [toast, setToast] = useState({
    visible: false,
    message: '',
    progress: 100,
    type: 'success', // "success" | "error"
  });

  // Toast management effect
  useEffect(() => {
    if (!toast.visible) return;

    const duration = 3000; // 3 seconds
    const step = 50; 
    let elapsed = 0;

    const id = setInterval(() => {
      elapsed += step;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);

      setToast(prev => ({
        ...prev,
        progress: pct,
      }));

      if (elapsed >= duration) {
        clearInterval(id);
        setToast(prev => ({
          ...prev,
          visible: false,
          progress: 100,
        }));
      }
    }, step);

    return () => clearInterval(id);
  }, [toast.visible]);

  // Handle form submission
  async function onsubmit(e) {
    e.preventDefault();

    try {
      // Dispatch the login action and wait for it to resolve
      await dispatch(LoginUser(formData)).unwrap(); 

      setToast({
        visible: true,
        message: "Login successful! Redirecting...",
        progress: 100,
        type: "success",
      });
      const role = res?.user?.role;

      // Navigate after a successful login (or immediately if desired)
      // Added a slight delay for toast visibility
    

    } catch (err) {
      // Determine the error message from the backend response
      const backendMsg =
        typeof err === "string"
          ? err
          : err?.response?.data?.message ||
            err?.message ||
            "Login failed. Please check your credentials.";

      setToast({
        visible: true,
        message: backendMsg,
        progress: 100,
        type: "error",
      });
    }
  } 

  // Component rendering starts here
  return (
    <>
      <div className="mx-auto w-full max-w-md space-y-5 p-6 md:p-8 bg-white shadow-xl rounded-xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Sign In</h1>
          <p className="mt-2 text-sm text-gray-500">
            Don't Have an Account?
            <Link className='font-semibold ml-2 text-indigo-600 hover:text-indigo-500 transition duration-150' to='/auth/register'>
              Sign Up
            </Link>
          </p>
        </div>

        {/* CommonForm for Login */}
        <CommonForm
          formControls={loginFormControls}
          buttonText={'Sign In'} 
          formData={formData}
          setFormData={setFormData}
          onSubmit={onsubmit}
        />
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
          <div
            className={`w-11/12 max-w-sm rounded-lg shadow-2xl p-4 transition-opacity duration-300 transform 
              ${
                toast.type === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white"
              }
              ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
            }
          >
            <p className="text-sm font-medium">{toast.message}</p>
            <div className="mt-2 h-1 w-full bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full transition-[width] duration-75 ease-linear bg-white/80"
                style={{ width: `${toast.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthLogin;