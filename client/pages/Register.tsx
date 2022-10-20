import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as React from "react";
import axios from "axios";
import validator from "validator";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Image,
  Row,
  Col,
  Card,
  Container,
  Spinner,
  Alert,
} from "react-bootstrap";
import logo from "../assets/logo.png";
import { useMutation } from "react-query";
import { logged } from "../slice/authSlice";
import { User } from "../@types/data";
export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authData = useAppSelector((state) => state.auth);
  const [email, setEmail] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [messageEmail, setMessageEmail] = React.useState<string | null>("");
  const [messageName, setMessageName] = React.useState<string | null>("");

  const { data, mutate, isSuccess, isLoading } = useMutation<
    any,
    any,
    { email: string; name: string }
  >((data) => {
    return axios.post("/api/register", data);
  });

  const setEmailInput = (value: string) => {
    if (!validator.isEmail(value)) {
      setMessageEmail("Email non validé");
    } else {
      setMessageEmail(null);
    }
    setEmail(value);
  };

  const setNameInput = (value: string) => {
    if (validator.isEmpty(value)) {
      setMessageName("Nom obligatoire");
    } else {
      setMessageName(null);
    }
    setName(value);
  };

  const signIn = () => {
    mutate({ email, name });
  };

  React.useEffect(() => {
    if (authData.access_token) {
      navigate("/admin");
    }
  }, [authData]);

  React.useEffect(() => {
    if (data && data["data"] && data["data"]["error"] === null) {
      dispatch(
        logged({
          error: null,
          access_token: data["data"]["token"],
          data: data["data"]["user"] as User,
        })
      );
    }
  }, [data]);

  if (authData.access_token) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Container
      className="h-100 animate__animated animate__zoomIn  animate__fast"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Row className="h-100 justify-content-center ">
        <Col
          className="align-self-center mt-2 mb-2"
          sm={10}
          md={8}
          lg={6}
          style={{ maxWidth: 480 }}
        >
          <Card className="shadow-lg border-sm">
            <Card.Body>
              <Form className="form-signin">
                <Form.Group className="mt-2 mb-4">
                  <div
                    className="justify-content-center"
                    style={{ textAlign: "center" }}
                  >
                    <Image
                      src={logo}
                      className="align-self-center mr-3"
                      width="150"
                      alt="..."
                    />
                  </div>
                </Form.Group>
                <Form.Group>
                  <div className="d-flex justify">
                    <Form.Label htmlFor="inputEmail" className="text-default">
                      Username
                    </Form.Label>
                  </div>
                  <Form.Control
                    value={name}
                    onChange={(t) => setNameInput(t.target.value)}
                    type="text"
                    placeholder="Username"
                  />
                </Form.Group>
                <Form.Group>
                  <div className="d-flex justify">
                    <Form.Label htmlFor="inputEmail" className="text-default">
                      E-mail
                    </Form.Label>
                  </div>
                  <Form.Control
                    value={email}
                    onChange={(t) => setEmailInput(t.target.value)}
                    type="text"
                    placeholder="exemple@mail.com"
                  />
                </Form.Group>

                {isSuccess && data != null && data["data"]["error"] != null && (
                  <Form.Group className="mt-4">
                    <Alert style={{ borderRadius: 0 }} variant={"danger"}>
                      {data["data"]["error"].toString()}
                    </Alert>
                  </Form.Group>
                )}
                <Form.Group className="mt-4">
                  <div className="d-grid gap-2">
                    <Button
                      disabled={messageEmail !== null || messageName !== null}
                      variant="default"
                      onClick={signIn}
                      type="button"
                      className="btn btn-block  bg-theme-color"
                    >
                      {isLoading ? (
                        <Spinner
                          as="span"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          animation="border"
                        />
                      ) : (
                        "Register"
                      )}
                    </Button>
                  </div>
                </Form.Group>
                <div className="d-flex mt-4 justify-content-center">
                  <Link to="/login" className="btn btn-link text-theme-color ">
                    Login
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
