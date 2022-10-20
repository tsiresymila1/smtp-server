import * as React from 'react';
import { Navbar, Container, Button, Dropdown, Col } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {FaBars, FaArrowLeft} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import avatar from '../assets/avatar.png'


export const  NavBar = ({ toggleSidenav }: { toggleSidenav?: () => void }) => {
  const emails = useAppSelector((state) => state.email);
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = React.useState<string>('Dashboard');

  React.useEffect(() => {
    const path = location.pathname.replace('/admin', '');
    switch (path) {
      case '/sent':
        setTitle(`Boite d'envois(${emails.sent.length})`);
        break;
      case '/draft':
          setTitle(`Brouillons(${emails.draft.length})`); 
          break;
      case '/archived':
            setTitle(`Archives(${emails.archived.length})`);
            break;
      default:
        setTitle(`Boite de réception(${emails.received.length})`); 
    }
  }, [location, emails]);

  const goBack = (event) => {
    event.stopPropagation();
    navigate(-1)
  }

  return (
    <Navbar
      id={'customNavBar'}
      bg="primary"
      variant="light"
      sticky={'top'}
      className={'shadow-none p-2 mb-4 bg-white'}
      style={{ height: '60px' }}
    >
      <Button id="menu-toggle" onClick={location.pathname.replace('/admin', '') === '/view' ? goBack: toggleSidenav} variant="link">
        {location.pathname.replace('/admin', '') === '/view' ? <FaArrowLeft
          className={'text-theme-color font-weight-bold'}
        />: <FaBars
          className={'text-theme-color font-weight-bold'}
        />}
      </Button>
      <Container fluid>
        <Navbar.Brand>{title}</Navbar.Brand>
      </Container>
      <Dropdown align="end">
        <Dropdown.Toggle
          as="div"
          className="btn"
          style={{ textDecoration: 'none' }}
        >
          <div className={'d-flex '}>
            <Col className={'mx-2 mt-1'}>
              <span className="align-middle">
                {'Tsiresy'} {'Mila'}
              </span>
            </Col>
            <Col>
              <LazyLoadImage
                wrapperProps={{ style: { width: 35, height: 35 } }}
                effect="blur"
                src={avatar}
                width="35"
                height="35"
                style={{ objectFit: 'contain' }}
                className="rounded-circle"
                alt="P"
              />
            </Col>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu
          className="p-0 border dropdown-menu-md-right"
          style={{
            borderRadius: 0,
            position: 'absolute',
            float: 'right',
            left: 'auto',
            right: '0.1em',
            minWidth: '200px',
          }}
        >
          <div className="row justify-content-center m-2">
            <LazyLoadImage
              wrapperProps={{ style: { width: 120, height: 100 } }} 
              effect="blur"
              src={avatar}
              width="100"
              height="100"
              style={{ objectFit: 'contain' }}
              className="rounded-circle"
              alt="P"
            />
          </div>
          <div className="row justify-content-center m-2">
            <div className="text-center" style={{ fontSize: '12px' }}></div>
          </div>
          <div className="bg-pink m-0 text-center ">
            <Link
              className="btn bg-primary btn-block text-center text-white w-100"
              style={{ fontSize: '13px' }}
              to={'/logout'}
            >
              <i
                className="fa fa-arrow-left text-teal mr-2"
                aria-hidden="true"
              />{' '}
              Deconnecter
            </Link>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </Navbar>
  );
}
