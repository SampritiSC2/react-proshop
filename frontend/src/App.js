import React from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage, { loader as productsLoader } from './pages/Home';
import RootLayoutPage from './pages/RootLayout';
import ProductDetailPage, { loader as productDetailLoader } from './pages/ProductDetail';
import ErrorPage from './pages/Error';
import CartPage from './pages/Cart';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ShippingPage from './pages/Shipping';
import PrivateRoute from './components/PrivateRoute';
import PaymentPage from './pages/Payment';
import PlaceOrderPage from './pages/PlaceOrder';
import OrderPage from './pages/Order';
import ProfilePage from './pages/Profile';
import OrderListPage, { loader as ordersLoader } from './pages/admin/OrderList';
import AdminRoute, { loader as checkAdminLoader } from './components/AdminRoute';
import ProductListPage from './pages/admin/ProductList';
import CreateProductPage from './pages/admin/CreateProduct';
import ProductEditPage from './pages/admin/ProductEdit';
import UserListPage, { loader as usersLoader } from './pages/admin/UserList';
import UserEditPage, { loader as userLoader } from './pages/admin/UserEdit';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayoutPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage />, loader: productsLoader },
      { path: 'page/:pageNumber', element: <HomePage />, loader: productsLoader },
      { path: 'product/:id', element: <ProductDetailPage />, loader: productDetailLoader },
      { path: 'cart', element: <CartPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: '',
        element: <PrivateRoute />,
        children: [
          { path: 'shipping', element: <ShippingPage /> },
          { path: 'payment', element: <PaymentPage /> },
          { path: 'place-order', element: <PlaceOrderPage /> },
          { path: 'order/:id', element: <OrderPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      {
        path: 'admin',
        element: <AdminRoute />,
        loader: checkAdminLoader,
        children: [
          { index: true, element: <Navigate to='order-list' /> },
          { path: 'order-list', element: <OrderListPage />, loader: ordersLoader },
          {
            path: 'order-list/page/:pageNumber',
            element: <OrderListPage />,
            loader: ordersLoader,
          },
          { path: 'product-list', element: <ProductListPage />, loader: productsLoader },
          {
            path: 'product-list/page/:pageNumber',
            element: <ProductListPage />,
            loader: productsLoader,
          },
          { path: 'new-product', element: <CreateProductPage /> },
          {
            path: 'edit-product/:id',
            element: <ProductEditPage />,
            loader: productDetailLoader,
          },
          {
            path: 'user-list',
            element: <UserListPage />,
            loader: usersLoader,
          },
          {
            path: 'user-list/page/:pageNumber',
            element: <UserListPage />,
            loader: usersLoader,
          },
          {
            path: 'edit-user/:id',
            element: <UserEditPage />,
            loader: userLoader,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
