import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany,OneToMany,CreateDateColumn} from "typeorm"
import { Email } from "./Email"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    address: string

    @Column()
    name: string

    @ManyToMany(()=>Email, (email)=>email.to)
    @JoinTable()
    to: Email[]

    @ManyToMany(()=>Email, (email)=>email.read)
    @JoinTable()
    read: Email[]
    
    @OneToMany(()=>Email, (email)=>email.from)
    from: Email

    @CreateDateColumn()
    created_at: Date

}
