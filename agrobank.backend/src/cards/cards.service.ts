import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, response, Response } from 'express';
import * as crypto from 'crypto';
import Redis from 'ioredis';
import { addCardDto, allCards, cardUuidDto, checkSmsDto, getSmsDto, monitoringDto, sendSmsDto, unverDto, updateCardDto } from './dto';
import { UuidDto } from 'src/dto';
import { AppService } from 'src/app.service';
import Helper from 'src/helpers/helper';
import RequestHelper from 'src/helpers/request';
import RSA from 'src/helpers/Rsa.helper';
import { ResponseHelper } from 'src/helpers/response';
// const redis = new Redis();

@Injectable()
export class CardsService {

    constructor(
        private http: HttpService, 
        private config: ConfigService,
        private logs: AppService,
        private RES: ResponseHelper
    ){}
    private redis = new Redis(this.config.get('REDIS_PORT'), this.config.get('REDIS_HOST'));
    private URL = this.config.get('CARDS_URL')
    private URL_V2 = this.config.get('CARDS_URL_V2')
    
    async getUserallCards(data:UuidDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid: headerData.uuid
            }

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'getuserallcards', "POST", sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id )
            this.RES.setError(500, 'error', res )
            
        }
    }
    
    async addcard(body: addCardDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { pan, is_main, expiry, title, template_id } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, pan, is_main, expiry, title, template_id
            }

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'addcard', "POST", sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id )
            this.RES.setError(500, 'error', res )
            
        }
    }
    
    async checksms(body: checkSmsDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { cardUuid, smsCode } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, cardUuid, smsCode
            }

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'checksms', "POST", sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id )
            this.RES.setError(500, 'error', res )
        }
    }

    async monitoring (body: monitoringDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const {uuid, cardUuid, monitoringType, month, year, fromDate, toDate, page, pageSize } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid || uuid, cardUuid, monitoringType, month, year, fromDate, toDate, page, pageSize
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest( this.URL_V2, 'monitoring', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res )
        }
    }   

    async deleteCard (body: cardUuidDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { cardUuid } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid: headerData.uuid, cardUuid
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign,  request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'delete', "DELETE", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res )
        }
    }   

    async getTemplates (body: cardUuidDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { cardUuid } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, cardUuid
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign,request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'updatedata', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res )
        }
    }   
    
    async update (body: updateCardDto, param:cardUuidDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid || body?.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const {uuid, title, template, makeMain, changeMain } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid || body?.uuid, cardUuid:param.cardUuid, title, template, makeMain, changeMain
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData 
            }
            let response = await RequestHelper.httpRequest(this.URL, 'update', "PUT", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res )
        }
    }   

    async info (body: cardUuidDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { cardUuid } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, cardUuid
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign,request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'info', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res )
        }
    }   

    async block (body: unverDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { cardUuid } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, cardUuid
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign,  request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'block', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res )
        }
    }    

    async sendsms (body: sendSmsDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { type } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, type
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'sendsms', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res )
        }
    }    

    async getcvv (body: getSmsDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { cardUuid, smsCode } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, cardUuid, smsCode
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'getCVV', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res )
        }
    }    
    
    async setPinCode (body: getSmsDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { cardUuid, smsCode, pin } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, cardUuid, smsCode, pin
            };

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign,  request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'setPinCode', "POST", sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res )
        }
    }    
}
