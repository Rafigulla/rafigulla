
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, response, Response } from 'express';
import * as crypto from 'crypto';
import Redis from 'ioredis';

import { acceptDto, UuidDto } from 'src/dto';
import { AppService } from 'src/app.service';
import { createP2PDto, getP2PinfoDto } from './dto';
import { visaAliasDto } from './dto/visaAliasDto';
import Helper from 'src/helpers/helper';
import RSA from 'src/helpers/Rsa.helper';
import RequestHelper from 'src/helpers/request';
import { ResponseHelper } from 'src/helpers/response';
// const redis = new Redis();

@Injectable()
export class P2pService {

    constructor(
        private http: HttpService, 
        private RES: ResponseHelper,
        private config: ConfigService,
        private logs: AppService
    ){}
    private redis = new Redis(this.config.get('REDIS_PORT'), this.config.get('REDIS_HOST'));
    private URL = this.config.get('P2P_URL')
    async getInfo(body: getP2PinfoDto, res: Response, req: Request): Promise<any> {
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { pan, phone, fio } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, pan, phone, fio
            }

            let sign = await RSA.rsaSign(sendParams, privateKey)      
            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'getinfo', "POST", sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id )
            this.RES.setError(500, 'error', res)
            
        }
    }

    async create (body: createP2PDto, res: Response, req: Request): Promise<any> {
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { cardFrom, cardTo, amount, fio, message } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, cardFrom, cardTo, amount, fio, message
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 
            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'create', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }  

    async accept (body: acceptDto, res: Response, req: Request): Promise<any> {
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { kassa_id } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, kassa_id
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 
            let serHeaders = {
                sign,  request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'accept', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }   
    
    async  transactionslist (body: UuidDto, res: Response, req: Request): Promise<any> {
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid || body.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            request_id = new Date().getTime() + headerData.uuid || body.uuid

            let sendParams = {
                uuid:headerData.uuid || body.uuid
            };
            
            let sign = await RSA.rsaSign(sendParams, privateKey) 
            let serHeaders = {
                sign,  request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'transactionslist', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }   

    async  visaAliasPage (body: visaAliasDto, res: Response, req: Request): Promise<any> {
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { contacts } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, contacts
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'visaAliasPage', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }  
    
    async  visaCreate (body: createP2PDto, res: Response, req: Request): Promise<any> {
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { cardFrom, cardTo, amount, fio, message } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, cardFrom, cardTo, amount, fio, message
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'visaCreate', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }   

}
