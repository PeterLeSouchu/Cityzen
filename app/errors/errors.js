const errors = {
  forbidden: {
    details: {
      type: 'Forbidden',
      status: 403,
      code: null,
    },
    message: {
      global: 'You need to be connected to access this route',
      permissionDenied: 'This activity not created by this user',
    },
  },
  internalServerError: {
    details: {
      type: 'Internal Server Error',
      status: 500,
      code: null,
    },
    message: {
      global: 'Internal Server Error. An internal error has occurred',
    },
  },
  activityError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notFound: 'Activity not found',
      alreadyStored: 'Activity already stored',
      input: 'Invalid input',
    },
  },
  userError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notFound: 'User not found',
      alreadyStored: 'User already stored',
      permissionDenied: 'The provided information is wrong',
      passwordDontMatch: "Passwords don't match",
      passwordNotGood: 'Invalid password',
      // pseudoExist: 'Pseudo already used',
      samePAsswords: "Don't use same password",
    },
  },
  cityError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notFound: 'City not found',
    },
  },
  countryError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notFound: 'Country not found',
    },
  },
  ratingError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notFound: "User don't rate this activity",
      alreadyRated: 'Activity already rated',
    },
  },
  fileError: {
    details: {
      type: 'Bad Request',
      status: 404,
      code: null,
    },
    message: {
      notAllowed: 'Invalid file type or file too large',
    },
  },
};

export default errors;
