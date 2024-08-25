const errors = {
  forbidden: {
    details: {
      type: 'Forbidden',
      status: 403,
      code: null,
    },
    message: {
      global: "Vous avez besoin d'être connecté pour accéder à cette route",
      permissionDenied: "Vous n'êtes pas propriétaire de cette activité",
    },
  },
  internalServerError: {
    details: {
      type: 'Internal Server Error',
      status: 500,
      code: null,
    },
    message: {
      global: 'Erreur serveur interne',
    },
  },
  activityError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notFound: 'Activité non trouvée',
      alreadyStored: 'Acitivité déja créée',
      input: 'Valeur incorrecte',
      addressFalse: 'Localisation incorrecte',
    },
  },
  userError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notOk: 'Les identifiants ne correspondent pas',
      alreadyStored: 'Utilisateur déja inscrit',
      permissionDenied: 'Accès refusé',
      passwordDontMatch: 'Les mots de passe ne correspondent pas',
      passwordNotGood: 'Mot de passe incorrect',
      samePAsswords: "N'utilisez pas le même mot de passe",
    },
  },
  cityError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notFound: 'Ville non trouvée',
    },
  },
  countryError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notFound: 'Pays non trouvé',
    },
  },
  ratingError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notFound: "L'utilisateur n'a pas noté cette activité",
      alreadyRated: "L'activité est déja notée",
    },
  },
  fileError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notAllowed: 'Le fichier image est incorrect ou trop volumineux',
    },
  },
};

export default errors;
