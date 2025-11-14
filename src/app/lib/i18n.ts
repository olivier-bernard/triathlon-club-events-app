type Translations = {
  activityTranslations: Record<string, string>;
  eventTypeTranslations: Record<string, string>;
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
  eventForm: {
    editTitle: string;
    createTitle: string;
    cancel: string;
    mainDetails: string;
    description: string;
    activity: string;
    selectActivity: string;
    type: string;
    date: string;
    time: string;
    location: string;
    contentAndOptions: string;
    seance: string;
    attendeesLimit: string;
    linksAndDistances: string;
    distanceOptions: string;
    distancePlaceholder: string;
    commaSeparated: string;
    eventLinks: string;
    linksPlaceholder: string;
    updateButton: string;
    createButton: string;
    addDistance: string;
  };
  adminUsers: {
    title: string;
    username: string;
    displayName: string;
    email: string;
    active: string;
    admin: string; // <-- Add this line
    delete: string;
  };
  profilePage: {
    title: string;
    infoTitle: string;
    adminUser: string;
    displayName: string;
    email: string;
    language: string;
    saveChanges: string;
    changePasswordTitle: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    passwordsDoNotMatch: string;
    updatePassword: string;
    timeFormat: string;
    timeFormat24h: string;
    timeFormat12h: string;
  };
  navBar: {
    admin: string;
    addEvent: string;
    manageUsers: string;
    signedInAs: string;
    profile: string;
    logout: string;
  };
  authPages: {
    signInTitle: string;
    loginFailed: string;
    username: string;
    usernamePlaceholder: string;
    password: string;
    forgotPasswordLink: string;
    signInButton: string;
    orSignInWith: string;
    signInWithGoogle: string;
    newUserPrompt: string;
    registerLink: string;
    registerTitle: string;
    email: string;
    displayName: string;
    registerButton: string;
    alreadyHaveAccountPrompt: string;
    signInLink: string;
    forgotPasswordTitle: string;
    forgotPasswordInstructions: string;
    sendResetLinkButton: string;
    resetPasswordTitle: string;
    newPassword: string;
    confirmNewPassword: string;
    updatePasswordButton: string;
    returnToLogin: string;
    languageLabel: string;
  };
  eventsContainer: {
    listView: string;
    calendarView: string;
  };
  chat: {
    title: string;
    startConversation: string;
    noMessages: string;
    writeMessage: string;
    privateNote: string;
    send: string;
    privateIndicator: string;
  };
  eventRegistration: {
    nameLabel: string,
    manualEntry: string,
    parcoursLabel: string,
    groupLevelLabel: string,
    registerButton: string,
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
    },
    eventForm: {
      editTitle: "Edit Event",
      createTitle: "Create New Event",
      cancel: "Cancel",
      mainDetails: "Main Details",
      description: "Description (Main Title)",
      activity: "Activity",
      selectActivity: "Select an activity",
      type: "Type",
      date: "Date",
      time: "Time (Format : 00:00)",
      location: "Location",
      contentAndOptions: "Content & Options",
      seance: "Training Session (Optional)",
      attendeesLimit: "Attendees Limit (0 for unlimited)",
      linksAndDistances: "Links & Distances",
      distanceOptions: "Distance Options",
      distancePlaceholder: "e.g., 10km, 21km, 42km",
      commaSeparated: "Separate values with a comma",
      eventLinks: "Event Links (GPX, etc.)",
      linksPlaceholder: "e.g., https://..., https://...",
      updateButton: "Update Event",
      createButton: "Create Event",
      addDistance: "Ajouter un parcours",
    },
    adminUsers: {
      title: "User Management",
      username: "Username",
      displayName: "Display Name",
      email: "Email",
      active: "Active",
      admin: "Admin",
      delete: "Delete",
    },
    profilePage: {
      title: "Your Profile",
      infoTitle: "Profile Information",
      adminUser: "Admin User",
      displayName: "Display Name",
      email: "Email Address",
      language: "Language",
      saveChanges: "Save Changes",
      changePasswordTitle: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      passwordsDoNotMatch: "Passwords do not match.",
      updatePassword: "Update Password",
      timeFormat: "Time Format",
      timeFormat24h: "24 hours",
      timeFormat12h: "12 hours (AM/PM)",
    },
    navBar: {
      admin: "Admin",
      addEvent: "Add Event",
      manageUsers: "Manage Users",
      signedInAs: "Signed in as {username}",
      profile: "Profile",
      logout: "Logout",
    },
    authPages: {
      signInTitle: "Sign in to your account",
      loginFailed: "Login failed. Please check your credentials.",
      username: "Username",
      usernamePlaceholder: "your_username",
      password: "Password",
      forgotPasswordLink: "Forgot password?",
      signInButton: "Sign In",
      orSignInWith: "Or sign in with",
      signInWithGoogle: "Sign in with Google",
      newUserPrompt: "New user?",
      registerLink: "Register",
      registerTitle: "Create a new account",
      email: "Email Address",
      displayName: "Display Name",
      registerButton: "Create Account",
      alreadyHaveAccountPrompt: "Already have an account?",
      signInLink: "Sign In",
      forgotPasswordTitle: "Forgot Your Password?",
      forgotPasswordInstructions: "Enter your email address and we will send you a link to reset your password.",
      sendResetLinkButton: "Send Reset Link",
      resetPasswordTitle: "Reset Your Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      updatePasswordButton: "Update Password",
      returnToLogin: "Return to login",
      languageLabel: "English",
    },
    eventsContainer: {
      listView: "List View",
      calendarView: "Calendar View",
    },
    chat: {
      title: "Discussion",
      startConversation: "Be the first to send a message",
      noMessages: "No messages yet.",
      writeMessage: "Write a message...",
      privateNote: "Private Note",
      send: "Send",
      privateIndicator: "Private note",
    },
    eventRegistration: {
      nameLabel: "Name",
      manualEntry: "Enter another athlete manually",
      parcoursLabel: "Course",
      groupLevelLabel: "Group Level",
      registerButton: "Register",
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
    },
    eventForm: {
      editTitle: "Modifier l'événement",
      createTitle: "Créer un nouvel événement",
      cancel: "Annuler",
      mainDetails: "Détails principaux",
      description: "Description (Titre principal)",
      activity: "Activité",
      selectActivity: "Sélectionnez une activité",
      type: "Type",
      date: "Date",
      time: "Heure (format: 00:00)",
      location: "Lieu",
      contentAndOptions: "Contenu & Options",
      seance: "Séance d'entraînement (Optionnel)",
      attendeesLimit: "Limite de participants (0 pour illimité)",
      linksAndDistances: "Parcours & Distances",
      distanceOptions: "Options de distance",
      distancePlaceholder: "ex: 10km, 21km, 42km",
      commaSeparated: "Séparez les valeurs par une virgule",
      eventLinks: "Liens de l'événement (GPX, etc.)",
      linksPlaceholder: "ex: https://..., https://...",
      updateButton: "Mettre à jour",
      createButton: "Créer l'événement",
      addDistance: "Ajouter un parcours",
    },
    adminUsers: {
      title: "Gestion des utilisateurs",
      username: "Nom d'utilisateur",
      displayName: "Nom d'affichage",
      email: "Email",
      active: "Actif",
      admin: "Admin",
      delete: "Supprimer",
    },
    profilePage: {
      title: "Votre profil",
      infoTitle: "Informations du profil",
      adminUser: "Utilisateur Admin",
      displayName: "Nom d'affichage",
      email: "Adresse e-mail",
      language: "Langue",
      saveChanges: "Enregistrer",
      changePasswordTitle: "Changer le mot de passe",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      confirmNewPassword: "Confirmer le nouveau mot de passe",
      passwordsDoNotMatch: "Les mots de passe ne correspondent pas.",
      updatePassword: "Mettre à jour le mot de passe",
      timeFormat: "Format de l'heure",
      timeFormat24h: "24 heures",
      timeFormat12h: "12 heures (AM/PM)",
    },
    navBar: {
      admin: "Admin",
      addEvent: "Ajouter un événement",
      manageUsers: "Gérer les utilisateurs",
      signedInAs: "Connecté en tant que {username}",
      profile: "Profil",
      logout: "Déconnexion",
    },
    authPages: {
      signInTitle: "Connectez-vous à votre compte",
      loginFailed: "La connexion a échoué. Veuillez vérifier vos identifiants.",
      username: "Nom d'utilisateur",
      usernamePlaceholder: "votre_nom_d_utilisateur",
      password: "Mot de passe",
      forgotPasswordLink: "Mot de passe oublié ?",
      signInButton: "Se connecter",
      orSignInWith: "Ou se connecter avec",
      signInWithGoogle: "Se connecter avec Google",
      newUserPrompt: "Nouvel utilisateur ?",
      registerLink: "S'inscrire",
      registerTitle: "Créer un nouveau compte",
      email: "Adresse e-mail",
      displayName: "Nom d'affichage",
      registerButton: "Créer le compte",
      alreadyHaveAccountPrompt: "Vous avez déjà un compte ?",
      signInLink: "Se connecter",
      forgotPasswordTitle: "Mot de passe oublié ?",
      forgotPasswordInstructions: "Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
      sendResetLinkButton: "Envoyer le lien",
      resetPasswordTitle: "Réinitialiser votre mot de passe",
      newPassword: "Nouveau mot de passe",
      confirmNewPassword: "Confirmer le nouveau mot de passe",
      updatePasswordButton: "Mettre à jour",
      returnToLogin: "Retour à la connexion",
      languageLabel: "Français",
    },
    eventsContainer: {
      listView: "Liste",
      calendarView: "Calendrier",
    },
    chat: {
      title: "Discussion",
      startConversation: "Soyez le premier à envoyer un message",
      noMessages: "Aucun message pour le moment.",
      writeMessage: "Écrire un message...",
      privateNote: "Note privée",
      send: "Envoyer",
      privateIndicator: "Note privée",
    },
    eventRegistration: {
      nameLabel: "Nom",
      manualEntry: "Entrer manuellement un autre athlète",
      parcoursLabel: "Parcours",
      groupLevelLabel: "Groupe de niveau",
      registerButton: "S'inscrire",
    }
  },
};

export const getTranslations = (lang: string): Translations => {
  return translations[lang] || translations.en;
};