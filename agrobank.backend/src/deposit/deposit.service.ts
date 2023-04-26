import { ConfigService } from '@nestjs/config';
import { AppService } from 'src/app.service';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import Redis  from 'ioredis';
import { depositByTypeDto, getMoneyDto, myDepositDto, openDepostDto, putMoneyDto, closeDepostDto, getVisaListDto } from './dto';
import { acceptDto, UuidDto } from 'src/dto';
import Helper from 'src/helpers/helper';
import RSA from 'src/helpers/Rsa.helper';
import RequestHelper from 'src/helpers/request';


@Injectable()
export class DepositService {
    constructor(
        private config: ConfigService,
        private http: HttpService,
        private logs: AppService
    ){}

    private redis = new Redis(this.config.get('REDIS_PORT'), this.config.get('REDIS_HOST'));
    private URL = this.config.get('DEPOSIT')

    async mydeposit (body: myDepositDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        try {
            const { uuid, cardUuid } = body
            let headerData = Helper.headerFormatted(req)
            request_id = new Date().getTime() + uuid

            let sendParams = {
                uuid, cardUuid
            };

            let privateKey = await this.redis.get(uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'myDeposit', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 

    async getDepositList (body: UuidDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        try {
            const { uuid } = body
            let headerData = Helper.headerFormatted(req)
            request_id = new Date().getTime() + uuid

            let sendParams = {
                uuid
            };

            let privateKey = await this.redis.get(uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'getDepozitList', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 

    async openDeposit (body: openDepostDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        try {
            const { uuid, cardUuid, code, currency, amount } = body
            let headerData = Helper.headerFormatted(req)
            request_id = new Date().getTime() + uuid

            let sendParams = {
                uuid, cardUuid, code, currency, amount
            };

            let privateKey = await this.redis.get(uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'openDeposit', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 

    async getDepositByType (body: depositByTypeDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        try {
            const { uuid, type } = body
            let headerData = Helper.headerFormatted(req)
            request_id = new Date().getTime() + uuid

            let sendParams = {
                uuid, type
            };

            let privateKey = await this.redis.get(uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'getDepozitListByType', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 

    async putMoneyDeposit (body: putMoneyDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        try {
            const { uuid, cardUuid, amount, book_id, branch_id } = body
            let headerData = Helper.headerFormatted(req)
            request_id = new Date().getTime() + uuid

            let sendParams = {
                uuid, cardUuid, amount, book_id, branch_id
            };

            let privateKey = await this.redis.get(uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'putMoneyDeposit', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 

    async getMoneyDeposit (body: getMoneyDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        try {
            const { uuid, cardUuid, amount, book_id  } = body
           let headerData = Helper.headerFormatted(req)
            request_id = new Date().getTime() + uuid

            let sendParams = {
                uuid, cardUuid, amount, book_id
            };

            let privateKey = await this.redis.get(uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'getMoneyDeposit', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 

    async closeDeposit (body: closeDepostDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        try {
            const { uuid, cardUuid, code, book_id  } = body
            let headerData = Helper.headerFormatted(req)
            request_id = new Date().getTime() + uuid

            let sendParams = {
                uuid, cardUuid, code, book_id
            };

            let privateKey = await this.redis.get(uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'closeDeposit', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 

    async openDepositAccept (body: acceptDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        try {
            const { kassa_id  } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, kassa_id
            };

            let privateKey = await this.redis.get(headerData.uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'openDepositAccept', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 

    async putMoneyDepositAccept (body: acceptDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        try {
            const { kassa_id  } = body
            let headerData = Helper.headerFormatted(req)
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, kassa_id
            };

            let privateKey = await this.redis.get(headerData.uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'putMoneyDepositAccept', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    }

    async closeMoneyDepositAccept (body: acceptDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        try {
            const { kassa_id  } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, kassa_id
            };

            let privateKey = await this.redis.get(headerData.uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'closeMoneyDepositAccept', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 

    async getMoneyDepositAccept (body: acceptDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        try {
            const { kassa_id  } = body
            request_id = new Date().getTime() + headerData.uuid

            let sendParams = {
                uuid:headerData.uuid, kassa_id
            };

            let privateKey = await this.redis.get(headerData.uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'getMoneyDepositAccept', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 
    
    async getVisaCardList (body: getVisaListDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        try {
            const { uuid, pan  } = body
            let headerData = Helper.headerFormatted(req)
            request_id = new Date().getTime() + uuid

            let sendParams = {
                uuid, pan
            };

            let privateKey = await this.redis.get(uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'getVisaCardList', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 

    async getAgroCardList (body: UuidDto, res: Response, req: Request): Promise<any> {
        let request_id:any
        try {
            const { uuid  } = body
            let headerData = Helper.headerFormatted(req)
            request_id = new Date().getTime() + uuid

            let sendParams = {
                uuid
            };

            let privateKey = await this.redis.get(uuid)

            if(!privateKey) return res.status(401).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Unauthorized",
                    "error_code": 401
                }
            })

            let sign = await RSA.rsaSign(sendParams, privateKey) 

            let serHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'getVisaCardList', 'POST', sendParams, serHeaders, req)
                    
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error occured!",
                    "error_code": 500
                }
            })
        }
    } 
}
