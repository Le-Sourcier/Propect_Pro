import React, { useState, useCallback } from "react";
import ImageUploader from "../../components/constants/imageUploader";
import PasswordStrengthMeter from "../../components/constants/passwordStrengthMeter";
import ProgressBar from "../../components/constants/progressBar";
import {
  RegistrationData,
  ValidationErrors,
  TouchedFields,
} from "../../components/types/auth";
import { Form } from "../../components/ui";
import Button from "../../components/utils/buttons";
import {
  validateEmail,
  validatePassword,
} from "../../components/utils/validator";

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => Promise<void>;
  loading: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  loading,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Please enter a valid email address",
      }));
    } else if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 8 characters long",
      }));
    }
  };

  const handleBlur = (field: keyof RegistrationData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateProgress = () => {
    const requiredFields = ["email", "password"];
    const optionalFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "address",
      "phone",
      "profileImage",
    ];

    const completedRequired = requiredFields.filter(
      (field) => formData[field as keyof RegistrationData]
    ).length;
    const completedOptional = optionalFields.filter(
      (field) => formData[field as keyof RegistrationData]
    ).length;

    // Calculate weighted progress (required fields count more)
    const progress = Math.round(
      ((completedRequired * 2 + completedOptional) /
        (requiredFields.length * 2 + optionalFields.length)) *
        100
    );

    // Extra boost if all required fields are filled
    if (completedRequired === requiredFields.length && agreed) {
      return Math.min(progress + 10, 100);
    }

    return progress;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateForm()) {
        setStep(2);
        window.scrollTo(0, 0);
      } else {
        // Mark all required fields as touched to show errors
        setTouched({
          email: true,
          password: true,
        });
      }
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !agreed) {
      // Mark all fields as touched to show errors
      setTouched({
        email: true,
        password: true,
      });
      return;
    }

    await onSubmit(formData);
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6 animate-fadeIn">
      <ProgressBar progress={progress} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            step === 1
              ? "translate-x-0 opacity-100"
              : "-translate-x-full absolute opacity-0 pointer-events-none"
          }`}
        >
          {/* Required Fields Section */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg shadow-sm border border-blue-100 mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-4 flex items-center">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs mr-2">
                1
              </span>
              Required Information
            </h3>
            <div className="space-y-4">
              <Form.Field2
                id="email"
                label="Email address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur("email")}
                error={errors.email}
                touched={touched.email}
                required
                autoComplete="email"
              />

              <Form.Field2
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur("password")}
                error={errors.password}
                touched={touched.password}
                required
                autoComplete="new-password"
              />

              <PasswordStrengthMeter password={formData.password} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleNextStep}
              variant="primary"
              disabled={
                !formData.email ||
                !formData.password ||
                !!errors.email ||
                !!errors.password
              }
            >
              Continue
            </Button>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out transform ${
            step === 2
              ? "translate-x-0 opacity-100"
              : "translate-x-full absolute opacity-0 pointer-events-none"
          }`}
        >
          {/* Optional Fields Section */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-600 text-white text-xs mr-2">
                2
              </span>
              Optional Information
              <span className="text-xs text-gray-500 ml-2">
                (Can be completed later in your profile)
              </span>
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Form.Field2
                  id="firstName"
                  label="First Name"
                  type="text"
                  value={formData.firstName || ""}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("firstName")}
                  autoComplete="given-name"
                  required
                />
                <Form.Field2
                  id="lastName"
                  label="Last Name"
                  type="text"
                  value={formData.lastName || ""}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("lastName")}
                  autoComplete="family-name"
                  required
                />
              </div>

              <Form.Field2
                id="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={handleInputChange}
                onBlur={() => handleBlur("dateOfBirth")}
                autoComplete="bday"
              />

              <Form.Field2
                id="address"
                label="Address"
                type="text"
                value={formData.address || ""}
                onChange={handleInputChange}
                onBlur={() => handleBlur("address")}
                autoComplete="street-address"
              />

              <Form.Field2
                id="phone"
                label="Phone Number"
                type="tel"
                value={formData.phone || ""}
                onChange={handleInputChange}
                onBlur={() => handleBlur("phone")}
                autoComplete="tel"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image
                </label>
                <ImageUploader
                  previewImage={previewImage}
                  onImageChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center mb-6 bg-blue-50 p-4 rounded-md border border-blue-100 transform transition">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500 underline transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500 underline transition-colors"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          <div className="flex justify-between">
            <Button type="button" onClick={handlePrevStep} variant="outline">
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading || !agreed}
              variant="primary"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
