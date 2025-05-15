import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  RefreshCw,
  Home,
  Mail,
  CheckCircle,
  Loader2,
  XCircle,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useSearchParams, useNavigate } from "react-router-dom";

const ExpiredToken: React.FC = () => {
  const { loading, verifyMail, reSendVerifyMail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("pk");

  const [status, setStatus] = useState<
    "pending" | "expired" | "error" | "success"
  >("pending");
  const [isRequestingNew, setIsRequestingNew] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const res = await verifyMail(token);

        if (!res || res.error) {
          console.error("Verification failed:", res?.error || "No response");
          setStatus("expired");
        } else {
          setStatus("success");
          setTimeout(() => navigate("/signin", { replace: true }), 3000);
        }
      } catch (err) {
        console.error("Unexpected verification error:", err);
        setStatus("error");
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleRequestNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await reSendVerifyMail(email);
      if (!res.error) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setIsRequestingNew(false);
          setEmail("");
          navigate("/signin");
        }, 3000);
      } else {
        setErrorMessage(res.error.message || "Échec de l'envoi du lien.");
      }
    } catch {
      setErrorMessage("Une erreur inattendue est survenue.");
    }
  };

  const renderContent = () => {
    switch (status) {
      case "pending":
        return (
          <>
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">
              Vérification de votre email...
            </h2>
            <p className="text-gray-500 mt-2">Veuillez patienter.</p>
          </>
        );

      case "success":
        return (
          <>
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700">
              Email vérifié !
            </h2>
            <p className="text-gray-600 mt-2">
              Redirection vers la page de connexion...
            </p>
          </>
        );

      case "expired":
      case "error":
        return (
          <>
            <AlertCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700">
              {status === "expired" ? "Lien expiré" : "Lien invalide"}
            </h2>
            <p className="text-gray-600 mt-2">
              {status === "expired"
                ? "Ce lien de vérification a expiré. Demandez-en un nouveau."
                : "Le lien est invalide ou corrompu."}
            </p>

            {!isRequestingNew && !isSubmitted && (
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setIsRequestingNew(true)}
                  disabled={loading}
                  className="w-full  px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition"
                >
                  <span
                    style={{ display: loading ? "none" : "block" }}
                    className=""
                  >
                    Renvoyer un lien
                  </span>
                  <RefreshCw
                    style={{ display: loading ? "block" : "none" }}
                    className="h- w- ml-2 animate-spin items-center flex justify-center "
                  />
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full px-5 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg flex items-center justify-center transition"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Retour à l'accueil
                </button>
              </div>
            )}

            {isSubmitted && (
              <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg">
                <h3 className="text-green-800 font-medium">Lien envoyé !</h3>
                <p className="text-green-600 text-sm mt-1">
                  Vérifiez votre boîte mail pour le nouveau lien.
                </p>
              </div>
            )}

            {isRequestingNew && !isSubmitted && (
              <form
                onSubmit={handleRequestNew}
                className="mt-6 space-y-4 text-left"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      disabled={loading}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:bg-gray-200 bg-gray-400 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      placeholder="exemple@mail.com"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center px-5 py-3 ${
                      loading
                        ? "bg-gray-300 hover:bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white rounded-lg transition`}
                  >
                    <span
                      style={{ display: loading ? "none" : "block" }}
                      className=""
                    >
                      Envoyer un nouveau lien
                    </span>
                    <RefreshCw
                      style={{ display: loading ? "block" : "none" }}
                      className="h- w- ml-2 animate-spin items-center flex justify-center "
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRequestingNew(false)}
                    className="w-full px-5 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition flex items-center justify-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center animate-fadeIn">
        {renderContent()}
        <p className="mt-6 text-xs text-gray-400">
          Besoin d’aide ? Contactez notre support.
        </p>
      </div>
    </div>
  );
};

export default ExpiredToken;
