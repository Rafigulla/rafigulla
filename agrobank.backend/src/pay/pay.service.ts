import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import Redis  from 'ioredis';
import { acceptPayDto, createPayDto, getTrDto, lastPlatejDto, panetInfoDto, ServiceListDto } from './dto';
import { AppService } from 'src/app.service';
import RSA from 'src/helpers/Rsa.helper';
import RequestHelper from 'src/helpers/request';
import Helper from 'src/helpers/helper';
import { ResponseHelper } from 'src/helpers/response';
import { UuidDto } from 'src/dto';

@Injectable()
export class PayService {
    constructor(
        private config: ConfigService,
        private logs: AppService,
        private RES: ResponseHelper
    ){}
    private redis = new Redis(this.config.get('REDIS_PORT'), this.config.get('REDIS_HOST'));
    private URL = this.config.get('PAY_URL')

    async categoryList(body:UuidDto, res: Response, req: Request): Promise<any>{
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
            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'categorylist', 'POST', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req,error, request_id)
            this.RES.setError(500, 'error',res)
        }
    }

    async serviceList (param: ServiceListDto, res: Response, req: Request ):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { category_id } = param
            request_id = new Date().getTime()+headerData.uuid

            let sendParams = {
                uuid:headerData.uuid,
                category_id
            };
            
            let sign = await RSA.rsaSign(sendParams, privateKey)      
            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'servicelist', 'POST', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id )
            this.RES.setError(500, 'error',res)
        }
        
    }
    
    async paynetInfo (body: panetInfoDto, res: Response, req: Request ):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { service_id, fields, serviceTitle } = body
            request_id = new Date().getTime()+ headerData.uuid

            let sendParams = {
                uuid:headerData.uuid,
                service_id,
                serviceTitle,
                fields
            }
            
            let sign = await RSA.rsaSign(sendParams, privateKey)      
            let serHeaders = {
                sign, request_id, ...headerData
            }

            let response = await RequestHelper.httpRequest(this.URL, 'paynetinfo', 'POST', sendParams, serHeaders,req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error',res)
        }
        
    }

    async createpayment (body: createPayDto, res: Response, req: Request ):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { partnerId, payData, amount, partnerNumber } = body
            request_id = new Date().getTime()+ headerData.uuid

            let sendParams = {
                uuid:headerData.uuid,
                partnerId, payData, amount, partnerNumber 
            }
            
            let sign = await RSA.rsaSign(sendParams, privateKey)      
            let serHeaders = {
                sign, request_id, ...headerData
            }

            let response = await RequestHelper.httpRequest(this.URL, 'createpayment', 'POST', sendParams, serHeaders,req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error',res)
        }
        
    }

    async acceptpayment (body: acceptPayDto, res: Response, req: Request ):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { kassa_id, card_uuid } = body
            request_id = new Date().getTime()+ headerData.uuid

            let sendParams = {
                uuid:headerData.uuid,
                kassa_id, card_uuid 
            }
            
            let sign = await RSA.rsaSign(sendParams, privateKey)      
            let serHeaders = {
                sign, request_id, ...headerData
            }

            let response = await RequestHelper.httpRequest(this.URL, 'acceptpayment', 'POST', sendParams, serHeaders,req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error',res)
        }
        
    }

    async getlastpayment (query: lastPlatejDto, res: Response, req: Request ):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { type, count } = query
            request_id = new Date().getTime()+ headerData.uuid

            let sendParams = {
                uuid:headerData.uuid,
                type, count: Number(count)
            }
            
            let sign = await RSA.rsaSign(sendParams, privateKey)      
            let serHeaders = {
                sign, request_id, ...headerData
            }

            let response = await RequestHelper.httpRequest(this.URL, 'getlastplatej', 'POST', sendParams, serHeaders,req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error',res)
        }
        
    }

    async getTransaction (param: getTrDto, res: Response, req: Request ):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { kassaId } = param
            request_id = new Date().getTime()+ headerData.uuid

            let sendParams = {
                uuid:headerData.uuid,
                kassaId: Number(kassaId)
            }
            
            let sign = await RSA.rsaSign(sendParams, privateKey)      
            let serHeaders = {
                sign, request_id, ...headerData
            }

            let response = await RequestHelper.httpRequest(this.URL, 'getTransaction', 'POST', sendParams, serHeaders,req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error',res)
        }
        
    }

    async allServices (res: Response, req: Request ):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            request_id = new Date().getTime()+ headerData.uuid

            let sendParams = {
                uuid:headerData.uuid
            }

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }

            let response = await RequestHelper.httpRequest(this.URL, 'allservices', 'GET', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error',res)
        }
        
    }
}
