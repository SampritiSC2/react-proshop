import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../store/slices/cartSlice';
import useInput from '../hooks/useInput';
import {
  validateAddress,
  validateCity,
  validateCountry,
  validatePostalCode,
} from '../utils/validators';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const {
    value: address,
    handleChange: handleAddressChange,
    handleBlur: handleAddressBlur,
    inValid: addressIsInvalid,
    error: addressError,
  } = useInput(shippingAddress.address || '', validateAddress);

  const {
    value: city,
    handleChange: handleCityChange,
    handleBlur: handleCityBlur,
    inValid: cityIsInvalid,
    error: cityError,
  } = useInput(shippingAddress.city || '', validateCity);

  const {
    value: postalCode,
    handleChange: handlePostalCodeChange,
    handleBlur: handlePostalCodeBlur,
    inValid: postalCodeIsInvalid,
    error: postalCodeError,
  } = useInput(shippingAddress.postalCode || '', validatePostalCode);

  const {
    value: country,
    handleChange: handleCountryChange,
    handleBlur: handleCountryBlur,
    inValid: countryIsInvalid,
    error: countryError,
  } = useInput(shippingAddress.country || '', validateCountry);

  const formIsInvalid = addressError || countryError || cityError || postalCodeError;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (formIsInvalid) return;
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps activeStep={1} />
      <h1 className='text-center'>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address' className='my-1'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            value={address}
            onChange={handleAddressChange}
            onBlur={handleAddressBlur}
          />
          {addressIsInvalid && <p className='text-danger'>{addressError}</p>}
        </Form.Group>
        <Form.Group controlId='city' className='my-1'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            value={city}
            onChange={handleCityChange}
            onBlur={handleCityBlur}
          />
          {cityIsInvalid && <p className='text-danger'>{cityError}</p>}
        </Form.Group>
        <Form.Group controlId='postalCode' className='my-1'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            value={postalCode}
            onChange={handlePostalCodeChange}
            onBlur={handlePostalCodeBlur}
          />
          {postalCodeIsInvalid && <p className='text-danger'>{postalCodeError}</p>}
        </Form.Group>
        <Form.Group controlId='country' className='my-1'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter country'
            value={country}
            onChange={handleCountryChange}
            onBlur={handleCountryBlur}
          />
          {countryIsInvalid && <p className='text-danger'>{countryError}</p>}
        </Form.Group>
        <Button type='submit' variant='dark' className='my-1' disabled={formIsInvalid}>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;
