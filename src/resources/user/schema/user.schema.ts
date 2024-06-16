import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument } from '../../../common/database/abstract.schema'

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  email: string

  @Prop()
  password: string

  @Prop()
  username: string

  @Prop()
  profilePic?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
