import "reflect-metadata"
import { DataSource } from "typeorm"
import { Attachment } from "./entity/Attachment"
import { Email } from "./entity/Email"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    synchronize: true,
    logging: false,
    entities: [User, Email, Attachment],
    migrations: [],
    subscribers: [],
    type: "sqlite",
    database: "mail.db",
})
