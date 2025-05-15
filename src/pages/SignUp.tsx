import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import PasswordField from "../components/ui/components/PasswordField";
import AuthLayout from "../layouts/AuthLayout";
import SocialButton from "../components/ui/components/SocialButton";
import { RegisterProps } from "../components/types/auth";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { ChevronLeft, RefreshCw } from "lucide-react";

const SignUp: React.FC = () => {
  const [step, setStep] = useState(1);
  const { signUp, loading } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterProps>({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
    address: "",
    city: "",
    postal_code: "",
    phone: "",
    agree_to_terms: false,
  });

  const updateFormData = (field: keyof RegisterProps, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData("image", e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      if (step === 1 && formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match!");
        return;
      }
      setStep(step + 1);
    } else {
      const res = await signUp(formData);
      if (!res.error) navigate("/signin");
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            First name*
          </label>
          <input
            disabled={loading}
            type="text"
            id="firstName"
            placeholder="John"
            autoComplete="given-name"
            value={formData.fname}
            onChange={(e) => updateFormData("fname", e.target.value)}
            className="w-full bg-white bg-opacity-70 backdrop-blur-md rounded-xl px-4 py-3 border outline-none transition-all duration-300 focus: border-neutral-400 focus:ring-2 focus:ring-neutral-100"
            required
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Last name*
          </label>
          <input
            disabled={loading}
            type="text"
            id="lastName"
            placeholder="Doe"
            autoComplete="family-name"
            value={formData.lname}
            onChange={(e) => updateFormData("lname", e.target.value)}
            className="w-full bg-white bg-opacity-70 backdrop-blur-md rounded-xl px-4 py-3 border outline-none transition-all duration-300 focus: border-neutral-400 focus:ring-2 focus:ring-neutral-100"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          Email*
        </label>
        <input
          disabled={loading}
          type="email"
          id="email"
          placeholder="youremail@example.com"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          className="w-full bg-white bg-opacity-70 backdrop-blur-md rounded-xl px-4 py-3 border outline-none transition-all duration-300 focus: border-neutral-400 focus:ring-2 focus:ring-neutral-100"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          Password*
        </label>
        <PasswordField
          value={formData.password}
          disabled={loading}
          onChange={(e) => updateFormData("password", e.target.value)}
          placeholder="Create a strong password"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          Confirm Password*
        </label>
        <PasswordField
          id="confirmPassword"
          value={formData.confirmPassword}
          disabled={loading}
          onChange={(e) => updateFormData("confirmPassword", e.target.value)}
          placeholder="Confirm your password"
        />
      </div>

      <div className="flex items-center pt-2">
        <input
          id="agree-terms"
          type="checkbox"
          checked={formData.agree_to_terms}
          disabled={loading}
          onChange={(e) => updateFormData("agree_to_terms", e.target.checked)}
          className="h-4 w-4 text-black rounded border-neutral-300 focus:ring-black"
          required
        />
        <label
          htmlFor="agree-terms"
          className="ml-2 block text-sm text-neutral-700"
        >
          I agree to the{" "}
          <Link to="#" className="font-medium text-black hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="#" className="font-medium text-black hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="photo"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          Profile Photo
        </label>
        <input
          type="file"
          id="photo"
          disabled={loading}
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full bg-white bg-opacity-70 backdrop-blur-md rounded-xl px-4 py-3 border outline-none transition-all duration-300 focus: border-neutral-400 focus:ring-2 focus:ring-neutral-100"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="123 Main St"
          autoComplete="street-address"
          value={formData.address}
          disabled={loading}
          onChange={(e) => updateFormData("address", e.target.value)}
          className="w-full bg-white bg-opacity-70 backdrop-blur-md rounded-xl px-4 py-3 border outline-none transition-all duration-300 focus: border-neutral-400 focus:ring-2 focus:ring-neutral-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            placeholder="City"
            value={formData.city}
            disabled={loading}
            onChange={(e) => updateFormData("city", e.target.value)}
            className="w-full bg-white bg-opacity-70 backdrop-blur-md rounded-xl px-4 py-3 border outline-none transition-all duration-300 focus: border-neutral-400 focus:ring-2 focus:ring-neutral-100"
          />
        </div>
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            placeholder="Postal Code"
            autoComplete="postal-code"
            disabled={loading}
            value={formData.postal_code}
            onChange={(e) => updateFormData("postal_code", e.target.value)}
            className="w-full bg-white bg-opacity-70 backdrop-blur-md rounded-xl px-4 py-3 border outline-none transition-all duration-300 focus: border-neutral-400 focus:ring-2 focus:ring-neutral-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          Phone Number
        </label>
        <PhoneInput
          country={"us"}
          value={formData.phone}
          disabled={loading}
          onChange={(phone) => updateFormData("phone", phone)}
          inputClass="!w-full !h-12 !text-base"
          containerClass="!w-full"
        />
      </div>
    </div>
  );

  return (
    <AuthLayout
      title={step === 1 ? "Create your account" : "Additional Information"}
      subtitle={
        step === 1 ? "Start with the essentials" : "Tell us more about yourself"
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-6">{step === 1 ? renderStep1() : renderStep2()}</div>

        <div className="space-y-3">
          <div className=" flex items-center justify-center gap-4">
            <motion.button
              type="reset"
              onClick={() => setStep(1)}
              style={{
                display: step === 1 ? "none" : "block",
              }}
              className="w-max bg-black text-white font-medium p-3 rounded-full transition-all duration-300 transform hover: bg-opacity-90 active:scale-[0.98] focus:outline-none"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronLeft />
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              style={
                !loading ? { cursor: "pointer" } : { cursor: "not-allowed" }
              }
              className={`w-full flex items-center justify-center ${
                loading ? "bg-gray-300 text-gray-400 " : "bg-black text-white"
              }  font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover: bg-opacity-90 active:scale-[0.98] focus:outline-none`}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {step === 1 ? "Continue" : !loading && "Create account"}

              <RefreshCw
                style={{ display: loading && step === 2 ? "block" : "none" }}
                className="h- w- ml-2 animate-spin items-center flex justify-center "
              />
            </motion.button>
          </div>
        </div>
      </form>
      {step === 1 && (
        <SocialButton
          icon={<FcGoogle size={24} />}
          text="Sign up with Google"
          onClick={() => toast.error("Google sign up not implemented yet.")}
          className="mt-4"
        />
      )}

      <div className="mt-8 text-center">
        <p className="text-neutral-600">
          Already have an account?{" "}
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/signin"
              className="font-semibold text-black hover:underline"
            >
              Sign in
            </Link>
          </motion.span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
