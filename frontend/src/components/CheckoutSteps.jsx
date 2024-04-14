import React from 'react';
import { Stepper } from 'react-form-stepper';

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    { label: 'Sign In' },
    { label: 'Shipping' },
    { label: 'Payment' },
    { label: 'Place Order' },
  ];
  return <Stepper activeStep={activeStep} steps={steps} />;
};

export default CheckoutSteps;
