import * as React from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import { Sidenav } from "../components/Sidenav";
import { NavBar } from "../components/NavBar";
import { Container } from "react-bootstrap";
import "../css/responsive.css";
import { BackDrop } from "../components/BackDrop";
import Favicon from "react-favicon";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addEmailReceivedItem, addEmailSentItem } from "../slice/emailSlice";
import { Email } from "../@types/data";

export const Home = () => {
  const [showBackDrop, setShowBackDrop] = React.useState<boolean>(false);
  const ref = React.createRef<HTMLDivElement>();
  const [alertCount, setAlertCount] = React.useState(undefined);
  const emails = useAppSelector((state) => state.email);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const toggle = () => {
    if (ref.current && ref.current?.classList.contains("toggled")) {
      setShowBackDrop(false);
      ref.current.classList.remove("toggled");
    } else {
      if (window.innerWidth <= 768) {
        setShowBackDrop(true);
      } else {
        setShowBackDrop(false);
      }
      ref.current?.classList.add("toggled");
    }
  };

  React.useEffect(() => {
    const noRead = emails?.received?.filter(
      (m) => !m.read?.map((u) => u.address).includes(auth.user?.address)
    ).length;
    console.log("Count : ", noRead);
    if (noRead > 0) {
      setAlertCount(noRead);
    } else {
      setAlertCount(null);
    }
  }, [emails]);

  React.useEffect(() => {
    function updateSize() {
      if (ref.current && ref.current.classList.contains("toggled")) {
        if (window.innerWidth <= 768) {
          setShowBackDrop(true);
        } else {
          setShowBackDrop(false);
        }
      } else {
        setShowBackDrop(false);
      }
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  React.useEffect(() => {
    const socket = io("/", {
      transports: ["websocket", "polling"],
    });
    socket.on("connect_error", () => {
      socket.io.opts.transports = ["polling", "websocket"];
    });
    socket.on("new-email", (data) => {
      if (auth.user !== null) {
        const email = data.email as Email;
        const target = data.target as string[];
        const source = data.source as string;
        const myadresss = auth.user?.address;
        if (target.includes(myadresss)) {
          dispatch(addEmailReceivedItem(email));
        }
        if (source === myadresss) {
          dispatch(addEmailSentItem(email));
        }
      }
    });
  }, []);

  return (
    <div className={`d-flex adminWidget`} id="wrapper" ref={ref}>
      <Favicon
        alertTextColor="white"
        animated={alertCount > 0}
        alertCount={alertCount}
        url="client/assets/logo.svg"
        keepIconLink={() => true}
      />
      <Sidenav toggle={toggle} />
      <div id="page-content-wrapper">
        <div
          id="admin-content"
          style={{
            marginTop: "0px",
            backgroundColor: "rgba(244,244,244,0.67)",
            minHeight: "100vh",
          }}
        >
          <NavBar toggleSidenav={toggle} />
          <Container fluid>
            <Outlet />
          </Container>
        </div>
      </div>
      <BackDrop visible={showBackDrop} onClick={toggle} />
    </div>
  );
};
