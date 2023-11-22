import { Injectable } from '@nestjs/common';
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
  chatRoom = {};

  async  create(createMessageDto: MessageDocument, clientId: string) {
    const message = new this.messageModel( {
      name: this.clientToUser[clientId],
      room: this.chatRoom[clientId],
      text: createMessageDto.text
    });

    await message.save();
    return message.toObject();
  }

  async findAll(room: string) {
    // return this.messages;
    console.log(room);
    
    const data = await this.messageModel.find({ room: room }).exec()
    console.log("day la data" + data);
    
    return data;
  }

  identify(name: string, clientID: string, inRoom: string) {
    this.clientToUser[clientID] = name;
    this.chatRoom[clientID] = inRoom;
    return Object.values([this.clientToUser, this.chatRoom[clientID]])
  }

  getClientName(clientId: string){
    return this.clientToUser[clientId]
  }
}
