import { Email } from "../@types/data";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArchive } from "react-icons/fa";
import { useAppSelector } from "../hooks/redux";
import { useDeleteEmailMutation } from "../app/services/emailApi";

export const MailItem = ({ email, url }: { email: Email; url: string }) => {
  const [showAction, setShowAction] = React.useState<boolean>(false);
  const [deleteEmail] = useDeleteEmailMutation();
  const [text, setText] = React.useState<string>('')
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

  React.useEffect(()=>{
    const div = document.createElement("div")
    div.innerHTML = email.subject+'-'+email.text
    const text = div.textContent || div.innerText || "";
    if(text.length > 180){ 
      setText(text.substring(0,160)+'...')
    }else{
      setText(text)
    }
  },[])

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
      {text}  
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
