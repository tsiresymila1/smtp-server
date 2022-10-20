import "reflect-metadata"
import { DataSource } from "typeorm"
import { Attachment } from "./entity/Attachment"
import { Email } from "./entity/Email"
import { User } from "./entity/User"
import os from 'node:os'
import { join } from "node:path"

export const AppDataSource = new DataSource({
    synchronize: true,
    logging: false,
    entities: [User, Email, Attachment],
    migrations: [],
    subscribers: [],
    type: "sqlite",
    database: join(os.homedir(),"mail.db"),
})
