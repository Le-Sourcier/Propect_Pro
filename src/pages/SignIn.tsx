import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import AuthLayout from "../layouts/AuthLayout";
import PasswordField from "../components/ui/components/PasswordField";
import SocialButton from "../components/ui/components/SocialButton";
import useAuth from "../hooks/useAuth";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const { loading, login } = useAuth();

  interface SignInFormEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: SignInFormEvent) => {
    e.preventDefault();
    // Implementation for sign in logic would go here
    const res = await login(email, password);
    if (!res.error) navigate("/");
  };

  const handleGoogleSignIn = () => {
    // Implementation for Google sign in would go here
    // console.log("Sign in with Google");
    toast.error("Google sign in not implemented yet.");
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Please enter your details">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="youremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white bg-opacity-70 backdrop-blur-md rounded-xl px-4 py-3 border outline-none transition-all duration-300 focus: border-neutral-400 focus:ring-2 focus:ring-neutral-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Password
            </label>
            <PasswordField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-black rounded border-neutral-300 focus:ring-black"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-neutral-700"
              >
                Remember me
              </label>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-neutral-700 hover:text-black"
              >
                Forgot password
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="space-y-3">
          <motion.button
            type="submit"
            disabled={loading}
            style={!loading ? { cursor: "pointer" } : { cursor: "not-allowed" }}
            className={`w-full flex items-center justify-center ${
              loading ? "bg-gray-300 text-gray-400 " : "bg-black text-white"
            }  font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover: bg-opacity-90 active:scale-[0.98] focus:outline-none `}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            <span style={{ display: loading ? "none" : "block" }} className="">
              Sign in
            </span>
            <RefreshCw
              style={{ display: loading ? "block" : "none" }}
              className="h- w- ml-2 animate-spin items-center flex justify-center "
            />
          </motion.button>
        </div>
      </form>
      <SocialButton
        icon={<FcGoogle size={24} />}
        text="Sign in with Google"
        onClick={handleGoogleSignIn}
        className="mt-4"
      />

      <div className="mt-8 text-center">
        <p className="text-neutral-600">
          Don't have an account?{" "}
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/signup"
              className="font-semibold text-black hover:underline"
            >
              Sign up
            </Link>
          </motion.span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
