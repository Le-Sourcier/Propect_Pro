import React from "react";
import { motion } from "framer-motion";

type SocialButtonProps = {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  className?: string;
};

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  text,
  onClick,
  className,
}) => {
  return (
    <motion.button
      className={`${className} w-full text-black font-medium py-3 px-6 rounded-full border border-neutral-200 transition-all duration-300 hover: bg-neutral-50 active:scale-[0.98] focus:outline-none flex items-center justify-center gap-3 mb-4`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </motion.button>
  );
};

export default SocialButton;
