import { Email } from "../@types/data";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArchive } from "react-icons/fa";
import { useAppSelector } from "../hooks/redux";
import { useDeleteEmailMutation } from "../app/services/emailApi";
import LinesEllipsis from "react-lines-ellipsis";

export const MailItem = ({ email, url }: { email: Email; url: string }) => {
  const [showAction, setShowAction] = React.useState<boolean>(false);
  const [deleteEmail] = useDeleteEmailMutation();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();
  const onCheck = (id, event) => {
    event.stopPropagation();
  };
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const viewEmail = () => {
    navigate("/admin/view", {
      state: email,
    });
  };

  return (
    <tr
      className="border-top border-bottom email-item"
      onClick={viewEmail}
      onMouseOver={() => setShowAction(true)}
      onMouseLeave={() => setShowAction(false)}
      style={{ fontSize: 14 }}
    >
      <td style={{ backgroundColor: "" }} width={50} onClick={stopPropagation}>
        <input type="checkbox" onChange={onCheck.bind(this, email.id)}></input>
      </td>
      <td
        style={
          email.read.map((u) => u.address).includes(auth.user?.address) ||
          url.endsWith("sent")
            ? {}
            : { fontWeight: "bold" }
        }
        width={100}
      >
        {email.from?.address.split("@")[0]}
      </td>
      <td
        width={"100%"}
        style={
          email.read.map((u) => u.address).includes(auth.user?.address) ||
          url.endsWith("sent")
            ? { textOverflow: "ellipsis" }
            : { textOverflow: "ellipsis", fontWeight: "bold" }
        }
      >
        {email.subject?.replace(/(<([^>]+)>)/gi, "")} -{" "}
        <LinesEllipsis
          text={email.text?.replace(/(<([^>]+)>)/gi, "").toString()}
          maxLine="1"
          ellipsis="..."
          trimRight
          basedOn="letters"
        />
      </td>
      <td
        style={{
          display:
            showAction && !location.pathname.endsWith("archived")
              ? "flex"
              : "none",
        }}
        width={50}
        onClick={stopPropagation}
      >
        <FaArchive onClick={() => deleteEmail(email.id)} />
      </td>
    </tr>
  );
};
