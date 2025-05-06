import { useState } from "react";
import { Database } from "lucide-react";
import { RegistrationData } from "../components/types/auth";
import useAuth from "../hooks/useAuth";
import RegistrationForm from "../components/constants/registerForm";
import toast from "react-hot-toast";

const App = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: RegistrationData) => {
    setLoading(true);

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName || "",
        formData.lastName || "",
        formData.phone || ""
      );

      if (error) {
        toast.error(`${error}` || "Failed to sign up");
      } else {
        toast.success("Account created successfully!");
      }
    } catch (error) {
      toast.error("An unexpected error occurred: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/20 to-transparent rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-100/20 to-transparent rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="h-14 w-14 bg-gradient-to-br from-blue-800 to-blue-600 text-white rounded-xl flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:rotate-3 shadow-lg animate-glow">
              <Database size={30} className="animate-pulse-light" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 animate-fadeIn">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 animate-fadeIn delay-100">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300 underline"
            >
              Sign in
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="glass-effect py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 hover-lift">
            <RegistrationForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
