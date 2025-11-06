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
    displayFilters: string;
    hideFilters: string;
  };
  homePage: {
    createEvent: string;
    allEvents: string;
    cycling: string;
    competitions: string;
  };
  calendar: {
    weekOf: string;
    noEventsThisWeek: string;
  };
  eventDetail: {
    back: string;
    editEvent: string;
    distances: string;
    attendees: string;
    circuits: string;
    circuitsDescription: string;
    route: string;
    todaysSession: string;
    alreadyRegistered: string;
    registerAnother: string;
    registerForEvent: string;
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
    },
    homePage: {
      createEvent: "Create Event",
      allEvents: "All Events",
      cycling: "Cycling",
      competitions: "Competitions",
    },
    calendar: {
      weekOf: "Week of",
      noEventsThisWeek: "No events for this week.",
    },
    eventDetail: {
      back: "Back",
      editEvent: "Edit Event",
      distances: "Distances",
      attendees: "Attendees",
      circuits: "Routes",
      circuitsDescription: "- Click to access the route or description",
      route: "Route",
      todaysSession: "Today's Session",
      alreadyRegistered: "You are already registered!",
      registerAnother: "You can register another person below.",
      registerForEvent: "Register for the event",
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
    },
    homePage: {
      createEvent: "Créer un événement",
      allEvents: "Tous les événements",
      cycling: "Cyclisme",
      competitions: "Compétitions",
    },
    calendar: {
      weekOf: "Semaine du",
      noEventsThisWeek: "Aucun événement pour cette semaine.",
    },
    eventDetail: {
      back: "Retour",
      editEvent: "Modifier l'événement",
      distances: "Distances",
      attendees: "Participants",
      circuits: "Circuits",
      circuitsDescription: "- Cliquer pour accéder au parcours ou description",
      route: "Parcours",
      todaysSession: "Séance du jour",
      alreadyRegistered: "Vous êtes déjà inscrit !",
      registerAnother: "Vous pouvez inscrire une autre personne ci-dessous.",
      registerForEvent: "S'inscrire à l'événement",
    }
  },
};

export const getTranslations = (lang: string): Translations => {
  return translations[lang] || translations.en; // Default to English
};