import React from "react";
import { motion } from "framer-motion";
import Logo from "../components/ui/components/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="max-h-screen w-full flex flex-col md:flex-row">
      {/* Left side - Form */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Logo />
            <motion.h1
              className="text-2xl font-bold mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="text-neutral-500 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {subtitle}
            </motion.p>
          </div>

          {children}
        </div>
      </motion.div>

      {/* Right side - Image */}
      <motion.div
        className="hidden lg:block flex-1 bg-neutral-900 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <img
          src="https://images.pexels.com/photos/8043823/pexels-photo-8043823.jpeg"
          alt="Emergency responder"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <motion.div
          className="absolute bottom-10 left-10 right-10 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-3">Responding with precision</h2>
          <p className="text-white/80">
            Equipping teams with the tools they need when every second counts.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
