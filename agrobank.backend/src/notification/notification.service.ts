import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import Redis from 'ioredis'
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';
import { UuidDto } from 'src/dto';
import { tokenDto, updateNewsDto, viewNewsDto } from './dto';
import Helper from 'src/helpers/helper';
import RSA from 'src/helpers/Rsa.helper';
import RequestHelper from 'src/helpers/request';
import { ResponseHelper } from 'src/helpers/response';

@Injectable()
export class NotificationService {
    constructor(
        private config: ConfigService,
        private logs: AppService,
        private RES: ResponseHelper
    ){}

    
    private redis = new Redis(this.config.get('REDIS_PORT'), this.config.get('REDIS_HOST'));
    private URL = this.config.get('NOTIFICATION')

    async allNews(res: Response, req: Request){
        let request_id: any
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
            let response = await RequestHelper.httpRequest(this.URL, 'allNews/'+headerData.uuid, 'GET', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }

    async updateToken(body:tokenDto, res: Response, req: Request){
        let request_id: any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {   
            const { token } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, token
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)      
            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'token', 'PUT', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }

    async updateNews(body:updateNewsDto, res:Response, req:Request){
        let request_id: any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {   
            const { param, like, newsId  } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, param, like, newsId
            };
            
            let sign = await RSA.rsaSign(sendParams, privateKey)      
            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'news', 'PUT', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }

    async view(body:viewNewsDto, res:Response, req:Request){
        let request_id: any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {   
            const { newsId  } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, newsId
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'view', 'PUT', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }

    async unreadCount(res:Response, req:Request){
        let request_id: any
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
            let response = await RequestHelper.httpRequest(this.URL, 'unreadCount/'+headerData.uuid, 'GET', sendParams, serHeaders, req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            this.RES.setError(500, 'error', res)
        }
    }
}
