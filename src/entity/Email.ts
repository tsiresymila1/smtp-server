import { Entity, PrimaryGeneratedColumn, Column, ManyToMany,OneToMany,ManyToOne,JoinTable, CreateDateColumn, DeleteDateColumn} from "typeorm"
import { Attachment } from "./Attachment"
import { User } from "./User"

@Entity()
export class Email {

    @PrimaryGeneratedColumn() 
    id: number

    @Column()
    subject: string

    @Column({nullable: true})
    text: string

    @Column({nullable: true})
    html: string

    @Column({nullable: true})
    messageId: string

    @ManyToMany(()=>User, (user)=>user.read)
    @JoinTable()
    read: User[]

    @ManyToOne(()=>User, (user)=>user.from)
    @JoinTable()
    from: User
    
    @ManyToMany(()=>User, (user)=>user.to)
    to: User[]

    @OneToMany(()=>Attachment, (attach)=>attach.mail)
    attachments: Attachment[]

    @CreateDateColumn()
    created_at: Date

    @DeleteDateColumn()
    deleted_at?: Date;

}
