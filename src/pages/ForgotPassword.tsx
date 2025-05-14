import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../layouts/AuthLayout";
import useAuth from "../hooks/useAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { loading, passwordForgetting } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await passwordForgetting(email);
    if (!res.error) setSubmitted(true);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send you a link to reset your password"
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} className="relative space-y-6">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="youremail@example.com"
              className="w-full bg-white bg-opacity-70 backdrop-blur-md rounded-xl px-4 py-3 border border-neutral-200 outline-none transition-all duration-300 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center items-center py-3 px-6 font-medium rounded-full transition-all duration-300 ${
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
              "Send reset link"
            )}
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
            Didn’t receive the email? Check your spam folder or{" "}
            <button
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
          <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import AuthLayout from "../layouts/AuthLayout";
// import useAuth from "../hooks/useAuth";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const { loading, passwordForgetting } = useAuth();

//   interface ForgotPasswordFormEvent extends React.FormEvent<HTMLFormElement> {}

//   const handleSubmit = async (e: ForgotPasswordFormEvent): Promise<void> => {
//     e.preventDefault();
//     const res = await passwordForgetting(email);
//     if (!res.error) {
//       console.log({ email });
//       setSubmitted(true);
//     }
//   };

//   return (
//     <AuthLayout
//       title="Reset your password"
//       subtitle="We'll send you a link to reset your password"
//     >
//       {!submitted ? (
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4 mb-6">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-neutral-700 mb-1"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 disabled={loading}
//                 placeholder="youremail@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full bg-white bg-opacity-70 backdrop-blur-md rounded-xl px-4 py-3 border outline-none transition-all duration-300 focus: border-neutral-400 focus:ring-2 focus:ring-neutral-100"
//                 required
//               />
//             </div>
//           </div>

//           <motion.button
//             type="submit"
//             disabled={loading}
//             className={`${
//               !loading
//                 ? " z-50 inset0 flex items-center bg-black/20 w-full p-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   "
//                 : "w-full  py-3 px-6 bg-black"
//             } text-white font-medium rounded-full transition-all duration-300 transform hover: bg-opacity-90 active:scale-[0.98] focus:outline-none`}
//             whileHover={{ scale: 1.01 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             {loading ? (
//               <span> Send reset link </span>
//             ) : (
//               <div className="bg-gray-500 w-max h-max p-6 rounded-xl">
//                 <div className="bg-black w-max h-max p-2 rounded-full">
//                   <div className="border-r-[.5px] border-white w-max h-max p-3 rounded-full animate-spin" />
//                 </div>
//               </div>
//             )}
//           </motion.button>
//         </form>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="bg-green-50 p-6 rounded-xl border border-green-100 text-center"
//         >
//           <svg
//             className="w-12 h-12 text-green-500 mx-auto mb-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <h3 className="text-lg font-medium text-green-800 mb-2">
//             Check your email
//           </h3>
//           <p className="text-green-600 mb-4">
//             We've sent a password reset link to <strong>{email}</strong>
//           </p>
//           <p className="text-sm text-green-600">
//             Didn't receive the email? Check your spam folder or{" "}
//             <button
//               type="button"
//               onClick={() => setSubmitted(false)}
//               className="text-green-800 font-medium hover:underline"
//             >
//               try again
//             </button>
//           </p>
//         </motion.div>
//       )}

//       <div className="mt-8 text-center">
//         <p className="text-neutral-600">
//           Remember your password?{" "}
//           <motion.span
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="inline-block"
//           >
//             <Link
//               to="/signin"
//               className="font-semibold text-black hover:underline"
//             >
//               Back to sign in
//             </Link>
//           </motion.span>
//         </p>
//       </div>
//     </AuthLayout>
//   );
// };

// export default ForgotPassword;
