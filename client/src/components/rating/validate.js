/* eslint-disable no-useless-escape */
const validate = (formValues) => {
  const regexUrl = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

  const errors = {};
  if (formValues.radarrUrl) {
    if (!regexUrl.test(formValues.radarrUrl)) {
      errors.radarrUrl = 'You must enter a valid URL';
    }
  }

  if (!formValues.radarrUrl) {
    // only if the user did not enter a title;
    errors.radarrUrl = 'You must enter Radarr URL';
  }

  if (!formValues.radarrApi) {
    errors.radarrApi = 'You must enter a Radarr API';
  }

  if (formValues.radarrApi) {
    if (formValues.radarrApi < 6) {
      errors.radarrApi = 'You must enter a valid Radarr API KEY';
    }
  }

  if (!formValues.keyOmdb) {
    errors.keyOmdb = 'You must enter a OMDB API KEY';
  }

  if (!formValues.desiredRating) {
    errors.desiredRating = 'You must enter a desired rating';
  }

  if (formValues.desiredRating) {
    if (isNaN(formValues.desiredRating)) {
      errors.desiredRating = 'Must be a number';
    }
  }

  if (formValues.desiredRating) {
    if (formValues.desiredRating < 0 || formValues.desiredRating > 10) {
      errors.desiredRating = 'Desired Rating must be in range 0 to 10';
    }
  }
  return errors;
};

export default validate;
