"use client";
import React, { useEffect, useState } from "react";
// import { ToggleSwitch } from "flowbite";
import Accordion from "../components/ui/components/Accordion";
import secureLocalStorage from "react-secure-storage";

export interface CookiePreferences {
  marketing: boolean;
  analytics: boolean;
  functional: boolean;
  essential: boolean;
}
interface ConsentSettingsProps {
  preferences: CookiePreferences;
  setPreferences: React.Dispatch<React.SetStateAction<CookiePreferences>>;
  isDeny: boolean;
  setIsDeny: React.Dispatch<React.SetStateAction<boolean>>;
  isAcceptAll: boolean;
  setIsAcceptAll: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
  onDeny: () => void;
  onAcceptAll: () => void;
  onClose: () => void;
}

const initialPreferences: CookiePreferences = {
  marketing: false,
  analytics: false,
  functional: false,
  essential: true, // Always enabled
};

const CookiesRule = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [isDeny, setIsDeny] = useState(false);
  const [isAcceptAll, setIsAcceptAll] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(initialPreferences);

  // Load saved preferences
  useEffect(() => {
    const savedPrefs = secureLocalStorage.getItem("cookie_preferences");
    const savedDeny = secureLocalStorage.getItem("deny");
    const savedAcceptAll = secureLocalStorage.getItem("acceptAll");

    if (savedPrefs && typeof savedPrefs === "object") {
      setPreferences(savedPrefs as CookiePreferences);
    }

    if (typeof savedDeny === "boolean") {
      setIsDeny(savedDeny);
    }

    if (typeof savedAcceptAll === "boolean") {
      setIsAcceptAll(savedAcceptAll);
    }

    // If no preferences are set, show the banner after a delay
    if (!savedPrefs) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setIsTriggered(true), 10); // Trigger animation after a delay
      }, 2000); // Show banner after 2 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true); // Start closing animation
    setTimeout(() => {
      setIsVisible(false);
      setIsTriggered(false);
      setIsClosing(false);
      setShowSettings(false);
    }, 500); // Match the CSS transition duration
  };

  const savePreferences = () => {
    secureLocalStorage.setItem("cookie_preferences", preferences);
    secureLocalStorage.setItem("deny", isDeny);
    secureLocalStorage.setItem("acceptAll", isAcceptAll);
    handleClose();
  };

  const handleDeny = () => {
    const newPreferences = {
      ...initialPreferences,
      essential: true, // Always keep essential cookies
    };

    setPreferences(newPreferences);
    setIsDeny(true);
    setIsAcceptAll(false);

    secureLocalStorage.setItem("cookie_preferences", newPreferences);
    secureLocalStorage.setItem("deny", true);
    secureLocalStorage.setItem("acceptAll", false);

    handleClose();
  };

  const handleAcceptAll = () => {
    const newPreferences = {
      marketing: true,
      analytics: true,
      functional: true,
      essential: true,
    };

    setPreferences(newPreferences);
    setIsAcceptAll(true);
    setIsDeny(false);

    secureLocalStorage.setItem("cookie_preferences", newPreferences);
    secureLocalStorage.setItem("acceptAll", true);
    secureLocalStorage.setItem("deny", false);

    handleClose();
  };

  const toggleSettings = () => {
    setShowSettings(true);
  };

  if (!isVisible) return null;

  if (showSettings) {
    return (
      <ConsentSettings
        preferences={preferences}
        setPreferences={setPreferences}
        isDeny={isDeny}
        setIsDeny={setIsDeny}
        isAcceptAll={isAcceptAll}
        setIsAcceptAll={setIsAcceptAll}
        onSave={savePreferences}
        onDeny={handleDeny}
        onAcceptAll={handleAcceptAll}
        onClose={handleClose}
      />
    );
  }

  return (
    <div
      className={`${
        isTriggered && !isClosing
          ? " z-50 translate-y-0 opacity-100 scale-100"
          : "translate-y-full opacity-0 scale-90"
      } transition-all duration-1000 ease-in-out z-30 fixed max-[540px]:left-0 max-[540px]:mx-3 inset-auto h-max max-[540px]:right-0 bottom-4 left-4 max-w-[400px] border border-gray-300 dark:border-gray-600 rounded-2xl dark:bg-[#1f2937] bg-white p-4 text-sm`}
    >
      <div className="dark:text-white text-black">
        This site uses tracking technologies. You may opt in or opt out of the
        use of these technologies.
      </div>
      {/* Row of buttons */}
      <div className="flex flex-wrap gap-2 justify-between items-center mt-4">
        <div className="flex gap-3">
          <button
            onClick={handleDeny}
            className="border border-gray-400 rounded-full py-1 px-3 text-[black] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500 mt-4"
          >
            Deny
          </button>
          <button
            onClick={handleAcceptAll}
            className="border border-gray-400 rounded-full py-1 px-3 text-[black] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500 mt-4"
          >
            Accept all
          </button>
        </div>
        <button
          className="border border-gray-400 rounded-full py-1 px-3 dark:text-[black] text-white bg-[black] dark:bg-white hover:bg-gray-800 dark:hover:bg-[#ffffffd7] mt-4"
          onClick={toggleSettings}
        >
          Consent Settings
        </button>
      </div>
    </div>
  );
};

export const ConsentSettings: React.FC<ConsentSettingsProps> = ({
  preferences,
  setPreferences,
  onSave,
  onDeny,
  onAcceptAll,
}) => {
  // Handle toggle change for a specific category
  const handleToggleChange = (key: keyof CookiePreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const ruleData = [
    {
      title: "Marketing",
      key: "marketing",
      content:
        "Marketing cookies and services are used to deliver personalized advertisements, promotions, and offers. These technologies enable targeted advertising and marketing campaigns by collecting information about users' interests, preferences, and online activities.",
    },
    {
      title: "Analytics",
      key: "analytics",

      content:
        "Analytics cookies and services are used for collecting statistical information about how visitors interact with a website. These technologies provide insights into website usage, visitor behavior, and site performance to understand and improve the site and enhance user experience.",
    },
    {
      title: "Functional",
      key: "functional",
      content:
        "Functional cookies and services are used to offer enhanced and personalized functionalities. These technologies provide additional features and improved user experiences, such as remembering your language preferences, font sizes, region selections, and customized layouts. Opting out of these cookies may render certain services or functionality of the website unavailable.",
    },
    {
      title: "Essential",
      key: "essential",
      content:
        "Essential cookies and services are used to enable core website features, such as ensuring the security of the website.",
    },
  ];

  return (
    <div className="select-none fixed inset-0 flex justify-center items-center z-50 bg-[black] bg-opacity-50 px-4">
      <div className="max-w-[500px] w-full border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-[#1f2937]  p-4 text-sm shadow-lg">
        <p className="text-lg text-[black] dark:text-white pb-4 font-bold">
          Your Privacy
        </p>
        <p className="text-[black] dark:text-white">
          This site uses tracking technologies. You may opt in or opt out of the
          use of these technologies.
        </p>
        {/* Contents */}
        <div className="pt-4">
          <Accordion>
            {ruleData.map((item, index) => (
              <Accordion.Panel key={index} index={index}>
                <Accordion.Title
                  className="flex items-center justify-between"
                  arrowIcon={
                    <ToggleSwitch
                      checked={preferences[item.key as keyof CookiePreferences]}
                      onChange={() =>
                        handleToggleChange(item.key as keyof CookiePreferences)
                      }
                      disabled={item.key === "essential"}
                    />
                  }
                >
                  {item.title}
                </Accordion.Title>
                <Accordion.Content>
                  <p className="mb-2 text-gray-800 dark:text-gray-500">
                    {item.content}
                  </p>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
        </div>
        <div className="flex flex-wrap justify-between gap-4 mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onDeny}
              className="border border-gray-400 rounded-lg py-1 px-3 text-[black] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500 mt-4"
            >
              Deny
            </button>
            <button
              onClick={onAcceptAll}
              className="border border-gray-400 rounded-lg py-1 px-3 text-[black] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500 mt-4"
            >
              Accept all
            </button>
          </div>
          <button
            onClick={onSave}
            className="border border-gray-400 rounded-lg py-1 px-3 dark:text-[black] text-white bg-[black] dark:bg-white hover:bg-gray-800 dark:hover:bg-[#ffffffd7] mt-4"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const ToggleSwitch = ({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) => {
  return (
    <div>
      <label className="inline-flex items-center cursor-pointer">
        <input
          checked={checked}
          onChange={onChange}
          type="checkbox"
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};

export default CookiesRule;
