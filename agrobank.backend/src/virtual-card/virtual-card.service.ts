import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from 'src/app.service';
import { UuidDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import * as crypto from 'crypto'
import Redis from 'ioredis';
import { checkVirtualCardDto } from './dto';
import Helper from 'src/helpers/helper';
import RSA from 'src/helpers/Rsa.helper';
import RequestHelper from 'src/helpers/request';
import { ResponseHelper } from 'src/helpers/response';

@Injectable()
export class VirtualCardService {
    constructor(
        private config: ConfigService,
        private RES: ResponseHelper,
        private logs: AppService
    ){}

    private redis = new Redis(this.config.get('REDIS_PORT'), this.config.get('REDIS_HOST'));
    private URL = this.config.get('VIRTUAL_CARD')
    
    async getVirtualCardList( res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            request_id = new Date().getTime() + headerData.uuid
            let sendParams = {
                uuid:headerData.uuid
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)
            let sendHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'getVirtualCardList', "POST", sendParams, sendHeaders,req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async checkVirtualCard(data: checkVirtualCardDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { type } = data
            request_id = new Date().getTime() + headerData.uuid
            let sendParams = {
                uuid:headerData.uuid, type
            };


            let sign = await RSA.rsaSign(sendParams, privateKey)

            let sendHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'checkVirtualCard', "POST", sendParams, sendHeaders,req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async openVirtualCard(data: checkVirtualCardDto, res:Response, req:Request):Promise<any>{
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { type} = data
            request_id = new Date().getTime() + headerData.uuid
            let sendParams = {
                uuid:headerData.uuid, type
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)
            let sendHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'openVirtualCard', "POST", sendParams, sendHeaders,req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

}
