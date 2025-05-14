import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../layouts/AuthLayout";
import PasswordField from "../components/ui/components/PasswordField";
import useAuth from "../hooks/useAuth";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { loading, resetPassword, verifyPasswordToken } = useAuth();
  const [userName, setUserName] = useState<string | null>("");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("pk");

  React.useEffect(() => {
    if (!token) {
      navigate("/not-found");
      return;
    }
    const checkToken = async () => {
      const res = await verifyPasswordToken(token);
      const { error, data } = res;
      if (error) {
        navigate("/not-found");
      }
      setUserName(data.firstName);
    };
    checkToken();
  }, [token, navigate]);

  interface SignInFormEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: SignInFormEvent) => {
    e.preventDefault();
    if (token) {
      const res = await resetPassword(token, password, confirmpassword);
      if (!res.error) navigate("/signin");
    }
  };

  return (
    <AuthLayout
      title={`Welcome back ${userName}`}
      subtitle="Please enter your new password"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              New Password
            </label>
            <PasswordField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Confirm Password
            </label>
            <PasswordField
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`mt-4 w-full flex justify-center items-center py-3 px-6 font-medium rounded-full transition-all duration-300 ${
                loading
                  ? "bg-black text-white cursor-not-allowed"
                  : "bg-black text-white hover:bg-opacity-90 active:scale-95"
              }`}
            >
              {loading ? (
                <div
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
                  role="status"
                  aria-label="Loading"
                />
              ) : (
                "Reset password"
              )}
            </motion.button>
          </div>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-neutral-600">
          Remember your password?{" "}
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/signin"
              className="font-semibold text-black hover:underline"
            >
              Sign In
            </Link>
          </motion.span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
