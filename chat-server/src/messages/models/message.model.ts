import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  name: string;

  @Prop()
  text: string;

  @Prop()
  room: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// MessageDocument có thể xem như một phiên bản được tạo ra từ sự kết hợp giữa DTO và model/entity. MessageSchema là phiên bản của model/entity được sử dụng chủ yếu trong ngữ cảnh của cơ sở dữ liệu MongoDB và Mongoose.