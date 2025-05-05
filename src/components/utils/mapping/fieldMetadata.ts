export const fieldMetadata: {
  [key: string]: {
    label: string;
    badge: string;
    description: string;
  };
} = {
  company_name: {
    label: "Nom de l'entreprise",
    badge: "clé",
    description: "Le nom légal de l'entreprise pour l'enrichissement.",
  },
  siret: {
    label: "Numéro SIRET",
    badge: "clé",
    description: "Identifiant unique français de l'établissement.",
  },
  siren: {
    label: "Numéro SIREN",
    badge: "clé",
    description: "Identifiant unique français de l'entreprise (9 chiffres).",
  },
  domain: {
    label: "Domaine",
    badge: "secondaire",
    description: "Le domaine principal de l'entreprise.",
  },
  email: {
    label: "Adresse e-mail",
    badge: "clé",
    description: "Adresse e-mail principale de contact.",
  },
  phone: {
    label: "Numéro de téléphone",
    badge: "clé",
    description: "Numéro de téléphone principal pour joindre l'entreprise.",
  },
  full_name: {
    label: "Nom complet",
    badge: "secondaire",
    description: "Nom complet du responsable.",
  },
  address: {
    label: "Adresse",
    badge: "secondaire",
    description: "Adresse physique de l'entreprise.",
  },
  zip_code: {
    label: "Code postal",
    badge: "secondaire",
    description: "Code postal pour la localisation de l'entreprise.",
  },
  city: {
    label: "Ville",
    badge: "secondaire",
    description: "Ville où l'entreprise est située.",
  },
  country: {
    label: "Pays",
    badge: "secondaire",
    description: "Pays de localisation de l'entreprise.",
  },
  naf_code: {
    label: "Code NAF",
    badge: "secondaire",
    description: "Code d'activité économique de l'entreprise.",
  },
  sector: {
    label: "Secteur d'activité",
    badge: "secondaire",
    description: "Secteur d'activité principal de l'entreprise.",
  },
  employee_count: {
    label: "Nombre d'employés",
    badge: "secondaire",
    description: "Nombre d'employés travaillant dans l'entreprise.",
  },
};