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
};

export default errors;
