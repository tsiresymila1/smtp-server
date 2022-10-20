import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm"
import { Email } from "./Email"

@Entity()
export class Attachment {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column('integer')
    timestamp: number

    @JoinColumn()
    @ManyToOne(()=> Email, (mail)=>mail.attachments)
    mail: Email


}
