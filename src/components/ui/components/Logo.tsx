import { motion } from "framer-motion";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
}

const sizes: Record<LogoSize, string> = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

const Logo = ({ size = "md" }: LogoProps) => {
  return (
    <motion.div
      className={`relative ${sizes[size]}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="absolute w-full h-full rounded-tl-xl bg-black" />
      <div className="absolute w-3/4 h-3/4 right-0 bottom-0 bg-white rounded-br-xl" />
    </motion.div>
  );
};

export default Logo;
