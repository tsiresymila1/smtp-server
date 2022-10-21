import {
  SMTPServer,
  SMTPServerAddress,
  SMTPServerAuthentication,
  SMTPServerAuthenticationResponse,
  SMTPServerDataStream,
  SMTPServerOptions,
  SMTPServerSession,
} from "smtp-server";
import { simpleParser, AddressObject, EmailAddress } from "mailparser";
import { EntityManager } from "typeorm";
import { writeFileSync } from "fs";
import { resolve, join } from "path";
import { Attachment } from "./entity/Attachment";
import { User } from "./entity/User";
import { Email } from "./entity/Email";
import { AppDataSource } from "./data-source";
import moment from "moment";

export class CustomSMTPServer extends SMTPServer {
  manager: EntityManager;
  onEmail: (email: Email) => void;

  constructor(
    manager: EntityManager,
    options?: SMTPServerOptions,
    onEmail?: (email: Email) => void
  ) {
    super(options);
    this.manager = manager;
    this.onEmail = onEmail;
  }

  onAuth(
    auth: SMTPServerAuthentication,
    session: SMTPServerSession,
    callback: (err: Error, response?: SMTPServerAuthenticationResponse) => void
  ): void {
    this.manager
      .findOne(User, {
        where: {
          address: auth.username,
        },
      })
      .then((user) => {
        if (user) {
          callback(null, {
            user: user,
            data: {},
          });
        } else {
          callback(null, {
            user: {},
            data: {},
          });
        }
      });
  }
  onMailFrom(
    address: SMTPServerAddress,
    session: SMTPServerSession,
    callback: (err?: Error) => void
  ): void {
    this.manager
      .findOne(User, {
        where: {
          address: address.address,
        },
      })
      .then((user) => {
        if (!user) {
          const user = new User();
          user.address = address.address;
          user.name = address.address.split("@")[0];
          this.manager
            .save(user)
            .then(() => callback())
            .catch((e) => callback(e));
        } else {
          callback();
        }
      })
      .catch((e) => callback(e));
  }
  onRcptTo(
    address: SMTPServerAddress,
    session: SMTPServerSession,
    callback: (err?: Error) => void
  ): void {
    this.manager
      .findOne(User, {
        where: {
          address: address.address,
        },
      })
      .then((user) => {
        if (!user) {
          const user = new User();
          user.address = address.address;
          user.name = address.address.split("@")[0];
          this.manager
            .save(user)
            .then(() => callback())
            .catch((e) => callback(e));
        } else {
          callback();
        }
      })
      .catch((e) => callback(e));
  }
  async getListAddress(data: AddressObject | AddressObject[]): Promise<User[]> {
    const users: User[] = [];
    let toAddress: EmailAddress[] = [];
    if (data instanceof Object) {
      toAddress = (data as AddressObject).value;
    } else {
      for (const address of data as AddressObject[]) {
        toAddress.push(...address.value);
      }
    }
    for (const address of toAddress) {
      let userS = await AppDataSource.manager.findOne(User, {
        where: {
          address: address.address,
        },
      });
      if (userS == null) {
        const user = new User();
        user.address = address.address;
        user.name = address.name;
        userS = await this.manager.save(user);
      }
      users.push(userS);
    }
    return users;
  }
  onData(
    stream: SMTPServerDataStream,
    session: SMTPServerSession,
    callback: (err?: Error) => void
  ): void {
    simpleParser(stream, {}, async (err, parsed) => {
      if (err) console.log("Error:", err);
      const attachments: Attachment[] = [];
      for (const attach of parsed.attachments) {
        const timestamp = moment().unix();
        const filename = attach.filename.trim().replace(/\s+/g, '');
        const filepath = join(
          resolve(__dirname, ".."),
          "public",
          `${timestamp}__${filename}`
        );
        writeFileSync(filepath, attach.content);
        const attachFile = new Attachment();
        attachFile.name = filename;
        attachFile.timestamp = timestamp;
        const attachFileS = await this.manager.save(attachFile);
        attachments.push(attachFileS);
      }
      const to: User[] = await this.getListAddress(parsed.to);
      const from: User[] = await this.getListAddress(parsed.from);
      const mail = new Email();
      mail.attachments = attachments;
      mail.to = to;
      mail.read = [];
      mail.messageId = parsed.messageId;
      mail.subject = parsed.subject;
      mail.text = parsed.textAsHtml;
      mail.html = parsed.html != false ? parsed.html : "";
      for (const f of from) {
        mail.from = f;
        const mailS = await this.manager.save(mail);
        if (this.onEmail) {
          this.onEmail(mailS);
        }
      }
      callback(null);
      stream.end();
    });
  }
  onConnect(session, callback) {
    callback(null);
  }
  onClose(session, callback) {
    if (callback) callback(null);
  }
}
