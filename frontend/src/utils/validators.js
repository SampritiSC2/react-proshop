import { isEmail, isPostalCode } from 'validator';

const isEmpty = (value) =>
  value === null || value === undefined || `${value}`.trim().length === 0;
const hasMinLength = (value, minLength) => value.trim().length >= minLength;
const isValidEmail = (value) => isEmail(value);
const hasMinValue = (value, minValue) => +value > minValue;

export const validateName = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Name is required';
  } else if (!hasMinLength(value, 6)) {
    error = 'Name should have minimum 6 characters';
  }
  return error;
};

export const validateEmail = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Email is required';
  } else if (!isValidEmail(value)) {
    error = 'Email is invalid';
  }
  return error;
};

export const validatePassword = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Password is required';
  } else if (!hasMinLength(value, 6)) {
    error = 'Password should have atleast 6 characters';
  }
  return error;
};

export const validateConfirmPassword = (value, passwordValue) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Confirm Password is required';
  } else if (value !== passwordValue) {
    error = 'Passwords do not match';
  }
  return error;
};

export const validateAddress = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Address cannot be empty';
  } else if (!hasMinLength(value, 6)) {
    error = 'Address should have atleast 6 characters';
  }
  return error;
};

export const validateCity = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'City cannot be empty';
  }
  return error;
};

export const validatePostalCode = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Postal Code cannot be empty';
  } else if (!isPostalCode(value, 'any')) {
    error = 'Postal Code is invalid';
  }
  return error;
};

export const validateCountry = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Country cannot be empty';
  }
  return error;
};

export const validateProductName = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Product name cannot be empty';
  } else if (!hasMinLength(value, 6)) {
    error = 'Product name should have atleast 6 characters';
  }
  return error;
};

export const validateProductDescription = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Product description cannot be empty';
  } else if (!hasMinLength(value, 6)) {
    error = 'Product description should have atleast 6 characters';
  }
  return error;
};

export const validateProductBrand = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Product brand cannot be empty';
  }
  return error;
};

export const validateProductCategory = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Product category cannot be empty';
  } else if (!hasMinLength(value, 6)) {
    error = 'Product category should have atleast 6 characters';
  }
  return error;
};

export const validateProductCountInStock = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Product countInStock cannot be empty';
  } else if (!hasMinValue(value, 0)) {
    error = 'Product counInStock should be greater than 0';
  }
  return error;
};

export const validateProductPrice = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Product price cannot be empty';
  } else if (!hasMinValue(value, 0)) {
    error = 'Product price should be greater than 0';
  }
  return error;
};

export const validateRating = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Rating should not be empty';
  }
  return error;
};

export const validateComment = (value) => {
  let error = null;
  if (isEmpty(value)) {
    error = 'Comment should not be empty';
  }
  return error;
};
