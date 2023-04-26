import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import Redis  from 'ioredis';
import { AppService } from 'src/app.service';
import Helper from 'src/helpers/helper';
import RequestHelper from 'src/helpers/request';
import { ResponseHelper } from 'src/helpers/response';
import RSA from 'src/helpers/Rsa.helper';
import { createHomeDto, createHomeServiceDto, homeServiceIdDto, paramHomeId, updateHomeDto, updateHomeServiceDto } from './dto';

// const redis = new Redis()

@Injectable()
export class MyhomeService {
    constructor(
        private config: ConfigService,
        private logs: AppService,
        private RES: ResponseHelper
    ){}
    
    private redis = new Redis(this.config.get('REDIS_PORT'), this.config.get('REDIS_HOST'));
    private URL = this.config.get('MY_HOME')
    async createHome (body: createHomeDto, res: Response, req: Request):Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {   
            const { name } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, name
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'createHome', 'POST', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }

    async getHome( res: Response, req: Request){
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            request_id =  new Date().getTime() + headerData.uuid

            let sendParams  = {
                uuid:headerData.uuid
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'getHome/'+headerData.uuid, 'GET', sendParams, serHeaders, req)
            return res.status(response.status).json(response.data)
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }

    async updateHome(param:paramHomeId, body:updateHomeDto, res: Response, req: Request){
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { name } = body
            request_id =  new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, homeId: Number(param.homeId), name
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'updateHome', 'PUT', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }
    
    async deleteHome (body:paramHomeId, res:Response, req:Request):Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            let { homeId } = body
            request_id =  new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid: headerData.uuid, homeId: Number(homeId)
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'deleteHome', 'DELETE', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }

    async createHomeService(body:createHomeServiceDto, res:Response, req:Request):Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { homeId, partnerId, partnerNumber, payData } = body
            request_id =  new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, homeId, partnerId, partnerNumber, payData
            };
            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'createHomeService', 'POST', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }

    async getHomeService (param:paramHomeId, res:Response, req:Request):Promise<any> { 
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { homeId } = param
            request_id =  new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, homeId
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'getHomeService', 'POST', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }

    async updateHomeService(param:homeServiceIdDto, body:updateHomeServiceDto, res:Response, req:Request):Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { homeId, partnerId, partnerNumber, payData } = body
            request_id =  new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, homeId: Number(homeId), serviceId: Number(param.serviceId), partnerId, partnerNumber, payData
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'updateHomeService', 'PUT', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }

    async deleteHomeService(body:homeServiceIdDto, res:Response, req:Request):Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { serviceId } = body
            request_id =  new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, serviceId:Number(serviceId)
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'deleteHomeService', 'DELETE', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }
}
