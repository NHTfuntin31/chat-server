import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './models/message.model';

@Injectable()
export class MessagesService {
  // messages: Message[] = [{name: 'tin', text: 'tin'}];
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}
  clientToUser = {};

  async  create(createMessageDto: MessageDocument, clientId: string) {
    const message = new this.messageModel( {
      name: this.clientToUser[clientId],
      text: createMessageDto.text
    });
    // this.messages.push(message);
    // return message

    await message.save();
    return message.toObject();
  }

  findAll() {
    // return this.messages;
    return this.messageModel.find().exec();
  }

  identify(name: string, clientID: string) {
    this.clientToUser[clientID] = name;
    return Object.values(this.clientToUser)
  }

  getClientName(clientId: string){
    return this.clientToUser[clientId]
  }
}
