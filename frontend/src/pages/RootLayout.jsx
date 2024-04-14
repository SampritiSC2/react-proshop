import React from 'react';
import Header from '../components/Header';
import { Container } from 'react-bootstrap';
import Footer from '../components/Footer';
import { Outlet, useNavigation } from 'react-router-dom';
import Loader from '../components/Loader';
import { ToastContainer } from 'react-toastify';

function RootLayoutPage() {
  const navigation = useNavigation();
  const loading = navigation.state === 'loading';
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          {!loading && <Outlet />}
          {loading && <Loader />}
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default RootLayoutPage;
