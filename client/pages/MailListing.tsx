import { Email } from "../@types/data";
import * as React from "react";
import { Table } from "react-bootstrap";

import { MailItem } from "../components/MailItem";
import {
  useGetEmailArchivedQuery,
  useGetEmailReceivedQuery,
  useGetEmailSentQuery,
} from "../app/services/emailApi";

export const MailListing = ({ url }: { url: string }) => {
  const emailReceivedApi = useGetEmailReceivedQuery();
  const emailSentApi = useGetEmailSentQuery();
  const emailArchivedApi = useGetEmailArchivedQuery();
  const [emails, setEmails] = React.useState<Email[]>([]);

  React.useEffect(() => {
    if (url.endsWith("sent")) {
      setEmails(emailSentApi.data ?? []);
    } else if (url.endsWith("deleted")) {
      setEmails(emailArchivedApi.data ?? []);
    } else {
      setEmails(emailReceivedApi.data ?? []);
    }
  }, [emailReceivedApi,emailSentApi,emailArchivedApi,url]);
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
