import { Email, User } from "../@types/data";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useQueryClient } from "react-query";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { removeEmailReceivedItem } from "../slice/emailSlice";

export const MailItem = ({ email, url }: { email: Email; url: string }) => {
  const [showAction, setShowAction] = React.useState<boolean>(false);
  const client = useQueryClient();
  const dispatch = useAppDispatch();
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

  const deleteEmail = async (e) => {
    e.stopPropagation();
    try {
      await client.fetchQuery("Deleteclient", () => {
        return axios.get(`/api/delete/${email.id}`, {
          headers: {
            Authorization: "Bearer " + auth.access_token,
            "Content-type": "application/json",
          },
        });
      });
      dispatch(removeEmailReceivedItem(email.id));
    } catch (e) {}
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
          email.read
            .map((u) => u.address)
            .includes(auth.user?.address) || url.endsWith("sent")
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
          email.read
            .map((u) => u.address)
            .includes(auth.user?.address) || url.endsWith("sent")
            ? { textOverflow: "ellipsis" }
            : { textOverflow: "ellipsis", fontWeight: "bold" }
        }
      >
        {email.subject?.replace(/(<([^>]+)>)/gi, "")} -{" "}
        {email.text?.replace(/(<([^>]+)>)/gi, "").slice()}
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
        <FaTrash onClick={deleteEmail} />
      </td>
    </tr>
  );
};
