import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsResponse
} from "@nestjs/websockets";
import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";



@WebSocketGateway(3002, {cors: '*:*', transports: ['websocket', "polling"]})
export class WsGateway implements OnGatewayConnection{
    constructor(
        private config: ConfigService
        ){}
        
        @WebSocketServer() server;
        
  private  redis = new Redis(this.config.get('REDIS_PORT'), this.config.get('REDIS_HOST'))
  async handleConnection(client:any): Promise<any> {
      try {

          let user = await this.jwtVerify(client)

          if(user === false) return await this.server.to(client.id).emit('unautharization', {status: 401, message: 'Invalid JWT Signature'})
          else if(!user?.uuid) return await this.server.to(client.id).emit('unautharization', {status: 401, message: 'Invalid JWT Signature'})

          this.redis.set(user.uuid + 'socket_id', client.id)
      } catch (error) {  
          console.log('handleConnection: ', error);
      }
  }

  async handleDisconnect(client: any): Promise<void> { 
      try {
          
      } catch (error) {
          console.log('handleDisconnect: ', error);
      }  
  }

  async unautharization(uuid: any): Promise<any>{
      try {
          let socket_id = await this.redis.get(uuid + 'socket_id')
            
          return await this.server.to(socket_id).emit('unautharization', {status: 401, message: 'Invalid JWT Signature'})
      } catch (error) {
          console.log('unautharization', error)
      }
  }

  async jwtVerify (client):Promise<any>{
      try {            
          let very = await jwt.verify(client.handshake['headers']['token'], this.config.get('SECRET_KEY'));
          return very;
      } catch (error) {
          return false
      }
  }
}


