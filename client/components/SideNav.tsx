import * as React from 'react';
import { Image, ListGroup, Navbar, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
  FaUsers,
  FaServer,
  FaCreditCard,
} from 'react-icons/fa';
import logo from '../assets/logo.png';


export const Sidenav = ({ toggle }: { toggle?: () => void }) => {
  const classList = 'p-3 list-group-item list-group-item-action';
  const location = useLocation();

  React.useEffect(() => {
    if (toggle && window.innerWidth <= 768) toggle();
  }, [location]);

  return (
    <div
      className="border-right"
      id="sidebar-wrapper"
      style={{ marginTop: '0px' }}
    >
      <Navbar
        variant="light"
        className={'shadow-none mb-5'}
        style={{ height: '60px', background: '#f2f2f2' }}
      >
        <Container>
          <Navbar.Brand
            as={'div'}
            className={'w-100 d-flex justify-content-start'}
          >
            <div>
              <Image
                alt=""
                src={logo}
                width="35"
                height="35"
                className="d-inline-block align-top"
              />{' '}
            </div>
            <div className={'mx-4'}>MAILBOX</div>  
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <ListGroup variant="flush" as={'div'}>
          <Link
            to="/admin"
            state={{ url: "/api/email" }}
            className={`${classList} ${
              location.pathname === '/admin' ? 'active' : ''
            }`}
          >
            <FaServer  />
            <span className="icon-menu-title"> Boite de réception</span>
          </Link>
          <Link
            to="/admin/sent"
            state={{ url: "/api/sent" }}
            className={`${classList}  ${
              location.pathname.startsWith('/admin/sent') ? 'active' : ''
            }`}
          >
            <FaUsers  />
            <span className="icon-menu-title"> Boite d'envois</span>
          </Link>
          <Link
            to="/admin/archived"
            state={{ url: "/api/deleted" }}
            className={`${classList}  ${
              location.pathname === '/admin/archived' ? 'active' : ''
            }`} 
          >
            <FaCreditCard />
            <span className="icon-menu-title"> Archived</span>
          </Link>      
        </ListGroup>
      </Container>
    </div>
  );
};
