import React from 'react';
import { useRouteError } from 'react-router-dom';
import Header from '../components/Header';
import { Container } from 'react-bootstrap';
import Footer from '../components/Footer';

const ErrorPage = () => {
  const error = useRouteError();

  let title = 'An Error Occured';
  let description = 'Something went wrong';

  if (error.status === 404) {
    title = '404 Not Found!';
    description = 'The resource cannot be found';
  }

  if (error.status === 500) {
    title = error.data.title;
    description = error.data.description;
  }

  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <div className='mt-3 text-center'>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default ErrorPage;
