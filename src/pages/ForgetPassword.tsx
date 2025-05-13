import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { ArrowLeft } from "lucide-react";

const ForgetPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { sendPasswordOtp, passwordForgetting, verifyPasswordOTP } = useAuth();
  const navigate = useNavigate();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "otp" && otpRefs.current[0]) otpRefs.current[0].focus();
  }, [step]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sendPasswordOtp(email);
      if (!res.error) setStep("otp");
    } catch {
      toast.error("Échec d’envoi du code");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return toast.error("Code OTP incomplet");
    setLoading(true);
    try {
      const otp = otpCode;
      console.log(otp);
      const res = await verifyPasswordOTP(email, otp);
      if (!res.error) setStep("reset");
    } catch {
      toast.error("Erreur de réinitialisation");
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error("Les mots de passe ne correspondent pas");
    setLoading(true);
    try {
      const res = await passwordForgetting(email, newPassword);
      // toast.success("Mot de passe réinitialisé !");
      if (!res.error) navigate("/login");
    } catch {
      toast.error("Erreur de réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      {/* LOGO */}
      <div className="mb-6">
        <img src="/logo.svg" alt="Logo" className="h-12 mx-auto" />
      </div>

      {/* TITLE + FORM */}
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        {/* Back button */}
        {step !== "email" && (
          <button
            onClick={() => setStep(step === "otp" ? "email" : "otp")}
            className="flex items-center gap-1 text-sm text-blue-600 mb-4 hover:underline"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
        )}

        <h2 className="text-xl font-bold text-center mb-6">
          {step === "email"
            ? "Mot de passe oublié ?"
            : step === "otp"
            ? "Vérifiez votre code OTP"
            : "Réinitialisez votre mot de passe"}
        </h2>

        {/* ÉTAPE 1 : EMAIL */}
        {step === "email" && (
          <form onSubmit={handleSendEmail} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adresse e-mail
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="example@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 border rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Envoyer le code"}
            </button>
          </form>
        )}

        {/* ÉTAPE 2 : OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <p className="text-sm text-gray-600">
              Code envoyé à : <strong>{email}</strong>
            </p>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  name="otp"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  ref={(el) => (otpRefs.current[index] = el)}
                  className="w-12 h-12 text-center text-lg border rounded-md shadow focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={otp.join("").length < 5}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold disabled:opacity-50"
            >
              Vérifier
            </button>
          </form>
        )}

        {/* ÉTAPE 3 : RESET PASSWORD */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="text-sm text-gray-600 mb-2">
              Réinitialisation pour : <strong>{email}</strong>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Nouveau mot de passe"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 border rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirmer le mot de passe"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 border rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold disabled:opacity-50"
            >
              {loading ? "Réinitialisation..." : "Réinitialiser"}
            </button>
          </form>
        )}

        {/* ➕ Lien retour login */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
