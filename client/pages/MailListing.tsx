import axios from "axios";
import { Email } from "../@types/data";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import * as React from "react";
import {  Table } from "react-bootstrap";
import { useQuery } from "react-query";
import {
  setEmailDeleted,
  setEmailReceived,
  setEmailSSent,
} from "../slice/emailSlice";
import { MailItem } from "../components/MailItem";

export const MailListing = ({ url }: { url: string }) => {
  const dispatch = useAppDispatch();
  const emailState = useAppSelector((state) => state.email);
  const auth = useAppSelector((state) => state.auth);
  const [emails, setEmails] = React.useState<Email[]>([]);
  const { data } = useQuery(`${url}EMail`, () => {
    return axios.get(url, {
      headers: {
        Authorization:
          "Bearer " + auth.access_token,
        "Content-type": "application/json",
      },
    });
  });

  React.useEffect(() => {
    if (data != null) {
      const emailData: Email[] = data["data"]["data"] as Email[];
      if (url.endsWith("sent")) {
        dispatch(setEmailSSent(emailData ?? []));
        setEmails(emailState.sent)
      } else if (url.endsWith("deleted")) {
        dispatch(setEmailDeleted(emailData ?? []));
        setEmails(emailState.archived)
      } else {
        dispatch(setEmailReceived(emailData ?? []));
        setEmails(emailState.received)
      }
    }
  }, [data]);


  React.useEffect(() => {
    if (url.endsWith("sent")) {
      setEmails(emailState.sent ?? []);
    } else if (url.endsWith("deleted")) {
      setEmails(emailState.archived ?? []);
    } else {
      setEmails(emailState.received ?? []);
    }
  }, [emailState]);
  return (
    <div>
      <Table borderless>
        <tbody>
          {emails.map((mail) => {
            return <MailItem key={mail.id} url={url} email={mail} />;
          })}
        </tbody>
      </Table>
    </div>
  );
};
