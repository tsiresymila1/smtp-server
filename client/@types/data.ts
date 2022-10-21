export type User = {
    id: number
    address: string
    name: string
    to: Email[]
    from: Email[]
    created_at?: Date
}

export type Email = {
    id: number
    messageId?: string
    subject: string
    read: User[]
    text?: string
    html?: string
    from: User
    to: User[]
    attachments: Attachment[]
    created_at: Date
}

export type Attachment =  {
    id: number
    name: string
    timestamp: number
    mail: Email
}