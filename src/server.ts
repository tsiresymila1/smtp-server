import {
  SMTPServer,
  SMTPServerAddress,
  SMTPServerAuthentication,
  SMTPServerAuthenticationResponse,
  SMTPServerDataStream,
  SMTPServerOptions,
  SMTPServerSession,
} from "smtp-server";
import { simpleParser,AddressObject,EmailAddress } from "mailparser";
import { EntityManager } from "typeorm";
import {writeFileSync} from 'fs'
import { join } from "path";
import { Attachment } from "./entity/Attachment";
import { User } from "./entity/User";
import { Email } from "./entity/Email";
import { AppDataSource } from "./data-source";
import moment from 'moment';

export class CustomSMTPServer extends SMTPServer {
  manager: EntityManager;
  onEmail: (email: Email)=>void

  constructor(manager: EntityManager, options?: SMTPServerOptions, onEmail?: (email: Email)=>void) {
    super(options);
    this.manager = manager;
    this.onEmail = onEmail;
  }

  onAuth(
    auth: SMTPServerAuthentication,
    session: SMTPServerSession,
    callback: (err: Error, response?: SMTPServerAuthenticationResponse) => void
  ): void {
    AppDataSource.manager.findOne(User, {
        where: {
            address: auth.username
        }
    }).then((user)=>{
        if(user){
            callback(null, {
                user: user,
                data: {}
            });
        }else{
            callback(null, {
                user: {},
                data: {}
            });
        }
    })
    
  }
  onMailFrom(
    address: SMTPServerAddress,
    session: SMTPServerSession,
    callback: (err?: Error) => void
  ): void {
    callback();
  }
  onRcptTo(
    address: SMTPServerAddress,
    session: SMTPServerSession,
    callback: (err?: Error) => void
  ): void {
    callback();
  }
  async getListAddress(data: AddressObject | AddressObject[]) : Promise<User[]>{
    const users: User[] = []
    let toAddress : EmailAddress[] = []
    if(data instanceof Object){
      toAddress = (data as AddressObject).value
    }
    else{
      for(const address of (data as AddressObject[])){
        toAddress.push(...address.value);
      }
    }
    for(const address of toAddress){
        let userS = await AppDataSource.manager.findOne(User,{
            where: {
                address: address.address
            }
        })
        if(userS == null){
            const user = new User()
            user.address = address.address
            user.name = address.name
            userS = await this.manager.save(user)
        }
        users.push(userS)
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
      const attachments: Attachment[] = []
      for(const attach of parsed.attachments){
        const timestamp = moment().unix()
        const filename = attach.filename
        const filepath = join(process.cwd(), 'public',`${timestamp}__${filename}`)
        writeFileSync(filepath,attach.content)
        const attachFile = new Attachment()
        attachFile.name = filename 
        attachFile.timestamp = timestamp
        const attachFileS = await this.manager.save(attachFile);
        attachments.push(attachFileS)
      }
      const to : User[] = await this.getListAddress(parsed.to)
      const from : User[] = await this.getListAddress(parsed.from)
      const mail = new Email()
      mail.attachments = attachments;
      mail.to = to
      mail.read = []
      mail.messageId = parsed.messageId
      mail.subject = parsed.subject
      mail.text = parsed.textAsHtml
      mail.html = (parsed.html != false)? parsed.html : ""
      for(const f of from){
        mail.from = f;
        const mailS = await this.manager.save(mail)
        if(this.onEmail){
            this.onEmail(mailS)
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
// const server = new SMTPServer({
//   banner: "Welcome to My Awesome SMTP Server",
//   name: "MAIL TEST",
//   size: 10 * 1024 * 1024 * 1024,
//   logger: true,
//   secure: false,
//   useXClient: true,
//   useXForward: true,
//   hidePIPELINING: true,
//   disabledCommands: ["AUTH", "STARTTLS"],
//   onAuth(auth, session, callback) {
//     let username = "testuser";
//     let password = "testpass";
//     // check username and password
//     if (
//       auth.username === username &&
//       (auth.method === "XOAUTH2"
//         ? auth.validatePassword(password)
//         : auth.password === password)
//     ) {
//       return callback(null, {
//         user: "userdata",
//       });
//     }
//     return callback(new Error("Authentication failed"));
//   },
//   onMailFrom(address, session, callback) {
//     if (/^deny/i.test(address.address)) {
//       return callback(new Error("Not accepted"));
//     }
//     callback();
//   },
//   onData(stream, session, callback) {
//     console.log("GEt stream : ", stream);
//     simpleParser(stream, {}, (err, parsed) => {
//       if (err) console.log("Error:", err);
//       console.log(parsed);
//       callback(null);
//       stream.end();
//     });
//   },
//   onRcptTo(to, session, callback) {
//     let err;

//     if (/^deny/i.test(to.address)) {
//       return callback(new Error("Not accepted"));
//     }
//     if (
//       to.address.toLowerCase() === "almost-full@example.com" &&
//       Number(session.envelope.mailFrom) > 100
//     ) {
//       err = new Error("Insufficient channel storage: " + to.address);
//       err.responseCode = 452;
//       return callback(err);
//     }
//     callback();
//   },

//   onConnect(session, callback) {
//     console.log("Connected Session : ", session);
//     callback(null);
//   },
//   onClose(session, callback) {
//     console.log("Close Session : ", session);
//     if (callback) callback(null);
//   },
// });

// server.on("error", (err) => {
//   console.log("Error from server : =>  %s", err.message);
// });

// server.listen(1027, "localhost", () => {
//   const address = server.server.address() as AddressInfo;
//   console.log(`SMTP SERVER Listening on [${address.address}]:${address.port}`);
// });
