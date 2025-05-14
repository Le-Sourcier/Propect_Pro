import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../layouts/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  interface ForgotPasswordFormEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = (e: ForgotPasswordFormEvent): void => {
    e.preventDefault();
    // Implementation for password reset logic would go here
    console.log({ email });
    setSubmitted(true);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send you a link to reset your password"
    >
      {!submitted ? (
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
          </div>

          <motion.button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover: bg-opacity-90 active:scale-[0.98] focus:outline-none"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            Send reset link
          </motion.button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-green-50 p-6 rounded-xl border border-green-100 text-center"
        >
          <svg
            className="w-12 h-12 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Check your email
          </h3>
          <p className="text-green-600 mb-4">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-green-600">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-green-800 font-medium hover:underline"
            >
              try again
            </button>
          </p>
        </motion.div>
      )}

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
              Back to sign in
            </Link>
          </motion.span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
