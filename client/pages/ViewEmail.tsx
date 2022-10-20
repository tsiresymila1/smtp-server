import { Email, User } from "../@types/data";
import * as React from "react";
import { useLocation } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import avatar from "../assets/avatar.png";
import { FaPaperclip } from "react-icons/fa";
import { useAppDispatch } from "../app/store";
import { readEmailReceived } from "../slice/emailSlice";
import { useMutation } from "react-query";
import axios from "axios";
import { useAppSelector } from "../hooks/redux";
export const ViewEmail = () => {
  const email = useLocation().state as Email;
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const { data, isSuccess, mutate } = useMutation<any, any, { id: number }>(
    (data) => {
      return axios.get(`/api/read/${data.id}`, {
        headers: {
          Authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("user"))["access_token"],
          "Content-type": "application/json",
        },
      });
    }
  );
  React.useEffect(() => {
    if (!email.read.map((u) => u.address).includes(auth.user?.address)) {
      mutate({ id: email.id });
    }
  }, []);

  React.useEffect(() => {
    if (isSuccess && data["data"]["success"] != null) {
      dispatch(readEmailReceived({ id: email.id, user: auth.user }));
    }
  }, [isSuccess]);
  return (
    <Container fluid>
      <Row>
        <div style={{ margin: 20, fontSize: 28 }}>
          {email.subject ?? "No subject"}
        </div>
      </Row>
      <Row>
        <LazyLoadImage
          wrapperProps={{ style: { width: 52, height: 52, marginRight: 20 } }}
          effect="blur"
          src={avatar}
          width="52"
          height="52"
          style={{ objectFit: "contain" }}
          className="rounded-circle"
          alt="P"
        />
        <Col md={10} sm={10} xs={10}>
          <div>
            <span style={{ fontWeight: "bold" }}>
              {email.from.name != ""
                ? email.from.name
                : email.from.address.split("@")[0]}
            </span>
            <span style={{ fontSize: "12px" }}>
              &nbsp;&nbsp;{"<" + email.from.address + ">"}
            </span>
          </div>
          <div>
            À{"   "}&nbsp;&nbsp;
            {email.to.map((e) => {
              return (
                <span key={e.id} style={{ fontSize: "12px" }}>
                  <span style={{ fontWeight: "bold" }}>
                    {e.name != "" ? e.name : e.address.split("@")[0]}
                  </span>
                  <span style={{ fontSize: "11px" }}>
                    {"<" + e.address + ">"}&nbsp;&nbsp; ,
                  </span>
                </span>
              );
            })}
          </div>
        </Col>
      </Row>
      <Row style={{ margin: 20, fontSize: 14 }}>
        <div dangerouslySetInnerHTML={{ __html: email.text }}></div>
        <div dangerouslySetInnerHTML={{ __html: email.html }}></div>
      </Row>
      <Row className="ps-8">
        {email.attachments?.map((a) => {
          return (
            <div key={a.id} className="email-item-attachment">
              <FaPaperclip /> <span style={{ marginLeft: 12 }}>{a.name}</span>
            </div>
          );
        })}
      </Row>
    </Container>
  );
};
