import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { logout } from '../store/slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      if (error?.response?.status === 401) {
        dispatch(logout());
        navigate('/login');
        return;
      }
      toast(error?.response?.data?.message || error.message);
    }
  };
  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
        <Container>
          {location.pathname !== '/' && (
            <LinkContainer to='/'>
              <Navbar.Brand>
                <img src={logo} alt='ProShop Logo' />
                ProShop
              </Navbar.Brand>
            </LinkContainer>
          )}
          {location.pathname === '/' && (
            <Navbar.Brand>
              <img src={logo} alt='ProShop Logo' />
              ProShop
            </Navbar.Brand>
          )}
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <LinkContainer to={{ pathname: '/cart', search: '' }}>
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' className='ms-1'>
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {!userInfo && (
                <LinkContainer to={{ pathname: '/login', search: '' }}>
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && (
                <NavDropdown title={userInfo.name}>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin'>
                  <LinkContainer to='/admin/product-list'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/user-list'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/order-list'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
