import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';

import { IDatabase } from 'pg-promise';
import * as crypto from 'crypto';
import Redis from 'ioredis';
import { AuthDto, changePasswordDto, passwordVerifyDto, refreshDto, resendDto, smsDataDto } from './dto';
import { AppService } from 'src/app.service';
import Helper from 'src/helpers/helper';
import RequestHelper from 'src/helpers/request';
import RSA from 'src/helpers/Rsa.helper';
import { ResponseHelper } from 'src/helpers/response';

@Injectable()
export class AuthService {
    constructor(
        private config: ConfigService,
        @Inject(NEST_PGPROMISE_CONNECTION) 
        private pg: IDatabase<any>,
        private RES: ResponseHelper,
        private logs: AppService
    ){}
    private redis = new Redis(this.config.get('REDIS_PORT'), this.config.get('REDIS_HOST'));
    private URL = this.config.get("AUTH_URL")

    async login (loginData:AuthDto, res:Response, req:Request):Promise<any> {
        let request_id:string
        let headerData = Helper.headerFormatted(req, true)
		try {
            const { phone } = loginData
            request_id = new Date().getTime() + phone

            let user:Array<{}> = await this.pg.query('select * from users where phone = $1', [phone])
              
            if (!user.length) {
                return this.RES.error_message(1001, headerData.lang, phone)
            }

            const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
                modulusLength: 512,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                }
            });

            console.log("publicKey ", publicKey);
            console.log("privateKey ", privateKey);
            
            let sendParams = {
                phone: phone,
                clientPublic: Helper.parseRSA(publicKey, 'PUBLIC')
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)
            let sendHeaders = {
                sign, request_id, ...headerData
            }
            
            let response = await RequestHelper.httpRequest(this.URL, 'signup', 'POST', sendParams, sendHeaders, req)

            if(response?.data?.action?.step == 'checkpassword') {
                this.redis.set(response?.data?.data?.uuid, privateKey)
            }   

            return res.status(response.status).json(response.data)  
        } catch (error) {
            this.logs.errorlog(req, error, request_id)         
            this.RES.setError(500, 'error', res)
        }
    }

    async checkPassword (passwordData: passwordVerifyDto, res:Response, req:Request ): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid || passwordData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { password } = passwordData
            request_id = new Date().getTime() + headerData.uuid || passwordData.uuid
            
            let sendParams = {
                password,
                uuid:headerData.uuid || passwordData.uuid
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)     
            let sendHeaders = {
                sign, request_id, ...headerData
            } 

            let response = await RequestHelper.httpRequest(this.URL, 'passwordverify', "POST", sendParams, sendHeaders, req)
            if(response?.data?.action?.step == 'pin') {
                this.redis.set(response?.data?.data?.uuid, privateKey)
            }   
            
            return res.status(response.status).json(response.data)  
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async checkSms(smsData: smsDataDto, res:Response, req:Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid || smsData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { smsCode } = smsData
            request_id = new Date().getTime() + headerData.uuid || smsData.uuid

            let sendParams = {
                smsCode,
                uuid:headerData.uuid || smsData.uuid
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)
            let sendHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL,'checksms','POST', sendParams, sendHeaders, req)
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async resendSms(resData:resendDto, res: Response, req:Request): Promise<any>  {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid || resData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            // const { uuid } = resData
            request_id = new Date().getTime() + headerData.uuid || resData.uuid

            let sendParams = {
                uuid:headerData.uuid || resData.uuid
            };
        
            let sign = await RSA.rsaSign(sendParams, privateKey)      
            let sendHeaders = {
                sign,  request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'resend', 'POST', sendParams, sendHeaders, req)
            return res.status(response.status).json(response.data)  
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async forgetPassword(forgetData: resendDto, res: Response, req:Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req, true)
        let privateKey = await this.redis.get(headerData.uuid || forgetData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            // const { uuid } = forgetData
            request_id = new Date().getTime() + headerData.uuid || forgetData.uuid

            let sendParams = {
                uuid:headerData.uuid || forgetData.uuid
            };
            
            let sign = await RSA.rsaSign(sendParams, privateKey)  
            let sendHeaders = {
                sign, request_id, ...headerData
            }

            let response = await RequestHelper.httpRequest(this.URL, 'forgetpassword', "POST", sendParams, sendHeaders, req)
            return res.status(response.status).json(response.data)  
        } catch (error) {
            this.logs.errorlog(req, error, request_id) 
            this.RES.setError(500, 'error', res)
        }   
    }

    async changePassword(changePassData: changePasswordDto, res: Response, req:Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid || changePassData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { oldPassword, newPassword } = changePassData
            request_id = new Date().getTime() + headerData.uuid || changePassData.uuid

            let sendParams = {
                uuid:headerData.uuid || changePassData.uuid, oldPassword, newPassword
            };
            
            let sign = await RSA.rsaSign(sendParams, privateKey)  
            let sendHeaders = {
                sign, request_id, ...headerData
            }

            let response = await RequestHelper.httpRequest(this.URL, 'changePassword', "POST", sendParams, sendHeaders, req)
            return res.status(response.status).json(response.data)  
        } catch (error) {
            this.logs.errorlog(req, error, request_id) 
            this.RES.setError(500, 'error', res)
        }
    }

    async refresh(forgetData: refreshDto, res: Response, req:Request): Promise<any> {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid || forgetData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            const { rt } = forgetData
            request_id = new Date().getTime() + headerData.uuid || forgetData.uuid
            headerData.token = rt
            let sendParams = {
                uuid:headerData.uuid || forgetData.uuid, rt
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)  
            let sendHeaders = {
                sign, request_id, ...headerData
            }

            let response = await RequestHelper.httpRequest(this.URL, 'refresh', "POST", sendParams, sendHeaders, req, false)
            return res.status(response.status).json(response.data)  
        } catch (error) {
            this.logs.errorlog(req, error, request_id) 
            this.RES.setError(500, 'error', res)
        }
    }

    async logout(resData:resendDto, res: Response, req:Request): Promise<any>  {
        let request_id:any
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid || resData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            // const { uuid } = resData
            request_id = new Date().getTime() + headerData.uuid || resData.uuid

            let sendParams = {
                uuid:headerData.uuid || resData.uuid
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)      

            let sendHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'logout', "POST", sendParams, sendHeaders, req)
            return res.status(response.status).json(response.data)  
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }
}
