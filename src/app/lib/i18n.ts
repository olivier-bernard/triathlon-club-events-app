import { Activity, EventType } from "@prisma/client";

type Translations = {
  activityTranslations: Record<Activity, string>;
  eventTypeTranslations: Record<EventType, string>;
  filterLabels: {
    activity: string;
    type: string;
    from: string;
    to: string;
    all: string;
    upcomingEvents: string;
    allEvents: string;
  };
};

export const translations: Record<string, Translations> = {
  en: {
    activityTranslations: {
      CYCLING: "Cycling",
      ROAD_RACING: "Road Racing",
      TRAIL_RUNNING: "Trail Running",
      SWIMMING: "Swimming",
      TRIATHLON: "Triathlon",
      RUN_AND_BIKE: "Run & Bike",
      AQUATHLON: "Aquathlon",
    },
    eventTypeTranslations: {
      TRAINING: "Training",
      COMPETITION: "Competition",
    },
    filterLabels: {
      activity: "Activity",
      type: "Type",
      from: "From",
      to: "To",
      all: "All",
      upcomingEvents: "Upcoming Events",
      allEvents: "All Events",
      displayFilters: "Display Filters",
      hideFilters: "Hide Filters",
    }
  },
  fr: {
    activityTranslations: {
      CYCLING: "Cyclisme",
      ROAD_RACING: "Course sur route",
      TRAIL_RUNNING: "Trail",
      SWIMMING: "Natation",
      TRIATHLON: "Triathlon",
      RUN_AND_BIKE: "Run & Bike",
      AQUATHLON: "Aquathlon",
    },
    eventTypeTranslations: {
      TRAINING: "Entrainement",
      COMPETITION: "Competition",
    },
    filterLabels: {
      activity: "Activité",
      type: "Type",
      from: "Du",
      to: "Au",
      all: "Tout",
      upcomingEvents: "Événements à venir",
      allEvents: "Tous les événements",
      displayFilters: "Afficher les filtres",
      hideFilters: "Masquer les filtres",
    }
  },
};

export const getTranslations = (lang: string): Translations => {
  return translations[lang] || translations.en; // Default to English
};