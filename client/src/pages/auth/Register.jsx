import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../../store/auth-slice/index";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    progress: 100,
    type: "success", // "success" | "error" if you want different colors
  });

  // Auto-hide + progress bar effect
  useEffect(() => {
    if (!toast.visible) return;

    const duration = 3000; // 3 seconds
    const step = 50;       // ms
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

  async function onsubmit(e) {
    e.preventDefault();

    try {
      // If RegisterUser is a createAsyncThunk, use unwrap to get actual payload
      const res = await dispatch(RegisterUser(formData)).unwrap();

      // Show success toast with backend message (if available)
      setToast({
        visible: true,
        message: res?.message || "Registered successfully!",
        progress: 100,
        type: "success",
      });

      // Navigate to login
      navigate("/auth/login");
    } catch (err) {
      // Show error toast with backend error message
       const backendMsg =
      typeof err === "string"
        ? err
        : err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again.";

      setToast({
        visible: true,
        message:  backendMsg,
        progress: 100,
        type: "error",
      });
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-md space-y-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create New Account
          </h1>
          <p>
            Already Have an Account ?
            <Link className="font-medium ml-3 text-primary" to="/auth/login">
              Login
            </Link>
          </p>
        </div>

        <CommonForm
          formControls={registerFormControls}
          buttonText={"Sign Up"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onsubmit}
        />
      </div>

      {/* Toast at bottom of screen */}
      {toast.visible && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
          <div
            className={`w-full max-w-sm rounded-lg shadow-lg px-4 py-3 
              ${
                toast.type === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white"
              }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
            <div className="mt-2 h-1 w-full bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 transition-[width] duration-75"
                style={{ width: `${toast.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthRegister;
