"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, createContext, useContext } from "react";

interface AccordionProps {
  children: React.ReactNode;
}

interface AccordionPanelProps {
  children: React.ReactNode;
  index: number; // Ajout d'un index pour identifier chaque panneau
}

interface AccordionTitleProps {
  children: React.ReactNode;
  arrowIcon?: React.ReactNode;
  className?: string;
}

interface AccordionContentProps {
  children: React.ReactNode;
}

// Contexte pour gérer quel panneau est ouvert
const AccordionContext = createContext<{
  openIndex: number | null;
  setOpenIndex: (index: number) => void;
} | null>(null);

// Composant principal Accordion
const Accordion: React.FC<AccordionProps> & {
  Panel: React.FC<AccordionPanelProps>;
  Title: React.FC<AccordionTitleProps>;
  Content: React.FC<AccordionContentProps>;
} = ({ children }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null); // Garde l'index ouvert

  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <div className="rounded-lg border text-[black] dark:text-[white] border-gray-300 dark:border-gray-700 w-full">
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// Composant Panel
const Panel: React.FC<AccordionPanelProps> = ({ children, index }) => {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("Accordion.Panel must be used within Accordion");

  const isOpen = context.openIndex === index; // Vérifie si ce panneau est ouvert

  const toggleOpen = () => {
    context.setOpenIndex(isOpen ? -1 : index); // Ferme si ouvert, sinon ouvre
  };

  return (
    <div>
      <AccordionContext.Provider
        value={{
          openIndex: isOpen ? index : null,
          setOpenIndex: context.setOpenIndex,
        }}
      >
        <div onClick={toggleOpen}>{children}</div>
      </AccordionContext.Provider>
    </div>
  );
};

// Composant Title
const Title: React.FC<AccordionTitleProps> = ({
  children,
  className,
  arrowIcon,
}) => {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("Accordion.Title must be used within Accordion.Panel");

  const isOpen = context.openIndex !== null;

  return (
    <div
      className={` border-b border-gray-700 border-opacity-50 flex justify-between items-center p-4 cursor-pointer font-semibold ${className}`}
    >
      {children}
      {arrowIcon !== undefined ? (
        arrowIcon
      ) : (
        <span>
          {isOpen ? (
            <ChevronUp className="w-6 h-6 text-gray-500" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-500" />
          )}
        </span>
      )}
    </div>
  );
};

// Composant Content
const Content: React.FC<AccordionContentProps> = ({ children }) => {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("Accordion.Content must be used within Accordion.Panel");

  const isOpen = context.openIndex !== null;

  return (
    <div
      className={`overflow-hidden transition-[max-height] duration-500 ${
        isOpen ? "max-h-[500px] ease-in" : "max-h-0 ease-out"
      }`}
    >
      <div className="p-4 bg-gray-300 dark:bg-[#131922] text-gray-300">
        {children}
      </div>
    </div>
  );
};

// Associer les sous-composants à Accordion
Accordion.Panel = Panel;
Accordion.Title = Title;
Accordion.Content = Content;

export default Accordion;
