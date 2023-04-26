import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AppService } from 'src/app.service';
import { UuidDto } from 'src/dto';
import * as FormData from 'form-data'
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { adminDto, adminIdDto, featureDto, featureIdDto, footerDto, paramPassportId, PassportDataDto, sessionDto, UpdatePassportDataDto } from './dto';
import { UpdateUserDataDto } from './dto/userDataDto';
import Helper from 'src/helpers/helper';
import RequestHelper from 'src/helpers/request';
import RSA from 'src/helpers/Rsa.helper';
import { ResponseHelper } from 'src/helpers/response';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';


@Injectable()
export class SettingsService {
    constructor(
        private config: ConfigService,
        private logs: AppService,
        private prisma: PrismaService,
        private RES: ResponseHelper,
        @Inject(NEST_PGPROMISE_CONNECTION) 
        private pg: IDatabase<any>,
    ){
        this.localizationCache()
    }

    
    public logger: Logger = new Logger('SettingsService');
    public cache: Array<any>
    private redis = new Redis(this.config.get('REDIS_PORT'), this.config.get('REDIS_HOST'));
    private URL = this.config.get('SETTING_URL')
    async getUserData(body: UuidDto, res:Response, req:Request):Promise<any>{
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

            let sendHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'getUserData', "POST", sendParams, sendHeaders,req)
            let iSadmin = await this.prisma.admins.findFirst({where: {uuid: headerData.uuid || '1'}})
            if(iSadmin) response.data.data.userData.isAdmin = true
            
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async localization(json: Object, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        try {
            const lang:string = req.headers['accept-language']
            let uuid = headerData.uuid
            request_id = new Date().getTime() + uuid
            let admin = await this.prisma.admins.findFirst({ where: { uuid } }) 
            
            if (!admin) {
                return this.response(res, req, request_id, 403, { message:"Buni o`zgartirish uchun sizda ruxsat yo'q" },{steep: 'toshini_ter'} )
            }

            let response = await this.prisma.message_list.updateMany({ where: { lang: lang }, data: { message: json['json'] } })   
            this.localizationCache()

            this.logs.log(req, request_id, response)
            return this.response(res, req, request_id, 200, {result: response}, {steep: 'getlocalization'})
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async getFeaturedAd(res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        try {
            const lang:string = req.headers['accept-language'] || 'ru'
            let uuid = headerData.uuid
            request_id = new Date().getTime() + uuid
            let admin = await this.prisma.admins.findFirst({ where: { uuid } }) 
            
            if (!admin) {
                return this.response(res, req, request_id, 403, { message:"Buni o`zgartirish uchun sizda ruxsat yo'q" },{steep: 'toshini_ter'} )
            }
            let response = await this.prisma.featured_ad.findMany()
            response.map(el => {
                el.title = el.title[lang]
                el.description = el.description[lang]
                el.link = el.link[lang]
            })
            
            this.logs.log(req, request_id, response)
            return this.response(res, req, request_id, 200, {result: response}, {steep: 'getlocalization'})
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async admin(param:adminIdDto, body:adminDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        try {
            const lang:string = headerData.lang || 'ru'
            let uuid = headerData.uuid
            request_id = new Date().getTime() + uuid
            
            let admin = await this.prisma.admins.findFirst({ where: { AND: {uuid, role: 'root'}} }) ;
            if (!admin) {
                return this.response(res, req, request_id, 403, { message:"Buni o`zgartirish uchun sizda ruxsat yo'q" },{steep: 'admins'} )
            }

            let userData =  await this.pg.query('select * from users where phone = $1', [body.phone])
            if (userData[0]?.uuid == uuid) {
                let responseText = {
                    uz: "Siz o`zngizni admin qila olmaysiz",
                    ru: "Вы не можете администрировать себя",
                    en: "You cannot admin yourself",
                }
                return this.response(res,req, request_id, 403, {message: responseText[lang]}, {}) 
            }
            
            let iSadmin = await this.prisma.admins.findFirst({where: {uuid: userData[0]?.uuid || '1'}})
            if (iSadmin) {
                let responseText = {
                    uz: "Bu foydalanuvchi allaqachon admin",
                    ru: "Этот пользователь уже является администратором",
                    en: "This user is already an admin",
                }
                
                return this.response(res, req, request_id, 403, {message: responseText[lang]}, {})
            }
            
            if(userData.length && body.set === true ) {
                let u = userData[0]
                let response = await this.prisma.admins.create({data:{
                    first_name: u.firstname,
                    last_name: u.lastname,
                    username: u.phone,
                    password: u.phone,
                    uuid: u.uuid,
                    role: 'admin',
                } })
                this.logs.log(req, request_id, response)
                return this.response(res, req, request_id, 200, {result: response}, {steep: 'admins'})
            } else if(body.set === false){
                let response = await this.prisma.admins.delete({where:{id: Number(param.id)}})
                this.logs.log(req, request_id, response)
                return this.response(res, req, request_id, 200, {result: response}, {steep: 'admins'})
            } else {
                let responseText = {
                    uz: "Bunday foydalanuvchi mavjud emas",
                    ru: "Такого пользователя не существует",
                    en: "No such user exists",
                }
                return this.response(res,req, request_id, 403, {message: responseText[lang]}, {})
            }
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async getAdmins(res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        try {
            console.log('dawd', headerData);
            
            const lang:string = headerData.lang || 'ru'
            let uuid = headerData.uuid
            request_id = new Date().getTime() + uuid
            
            let admins= await this.prisma.admins.findMany() 

            
           
            this.logs.log(req, request_id, admins)
            return this.response(res, req, request_id, 200, {result: admins}, {steep: 'admins'})
        } catch (error) {
            console.log(error);
            
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async featuredAdUpdate(param:featureIdDto, json:featureDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        try {
            const lang:string = req.headers['accept-language']
            let uuid = headerData.uuid
            request_id = new Date().getTime() + uuid
            let admin = await this.prisma.admins.findFirst({ where: { uuid } }) 
            
            if (!admin) {
                return this.response(res, req, request_id, 403, { message:"Buni o`zgartirish uchun sizda ruxsat yo'q" },{steep: 'toshini_ter'} )
            }
            let response = await this.prisma.featured_ad.updateMany({where: {id:Number(param.id)}, data: {...json}})   

            this.logs.log(req, request_id, response)
            return this.response(res, req, request_id, 200, {result: response}, {steep: 'getlocalization'})
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async featuredAdDelete(param:featureIdDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        try {
            const lang:string = req.headers['accept-language']
            let uuid = headerData.uuid
            request_id = new Date().getTime() + uuid
            let admin = await this.prisma.admins.findFirst({ where: { uuid } }) 
            
            if (!admin) {
                return this.response(res, req, request_id, 403, { message:"Buni o`zgartirish uchun sizda ruxsat yo'q" },{steep: 'toshini_ter'} )
            }
            let response = await this.prisma.featured_ad.delete({where: {id: Number(param.id)}})  

            this.logs.log(req, request_id, response)
            return this.response(res, req, request_id, 200, {result: response}, {steep: 'getlocalization'})
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async featuredAdCreate(json:featureDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        try {
            const lang:string = req.headers['accept-language']
            let uuid = headerData.uuid
            request_id = new Date().getTime() + uuid
            let admin = await this.prisma.admins.findFirst({ where: { uuid } }) 
            
            if (!admin) {
                return this.response(res, req, request_id, 403, { message:"Buni o`zgartirish uchun sizda ruxsat yo'q" },{steep: 'toshini_ter'} )
            }
            let response = await this.prisma.featured_ad.create({data: json})   

            this.logs.log(req, request_id, response)
            return this.response(res, req, request_id, 200, {result: response}, {steep: 'getlocalization'})
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async getLocalization(res:Response, req:Request):Promise<any>{
        let request_id
        try {
            let lang = req.headers['accept-language']
            request_id = new Date().getTime().toString()
            if(!['uz', 'ru', 'en'].includes(lang)) lang = 'uz' 

            let cache = this.cache.filter(el => el.lang == lang)

            this.logs.log(req, request_id, [cache[0]])
            return res.status(200).json(cache[0]) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async sessions(data: UuidDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid || data.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            request_id = new Date().getTime() + headerData.uuid || data.uuid
            let sendParams = {
                uuid:headerData.uuid || data.uuid
            };

            let sign = await RSA.rsaSign(sendParams, privateKey)

            let sendHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'sessions', "POST", sendParams, sendHeaders,req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async deleteSessions(userUuid: sessionDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            let { sessionId } = userUuid
            request_id = new Date().getTime() + headerData.uuid

            let session_id = parseInt(sessionId)

            if (!session_id) {
                let message = await this.prisma.error_list.findFirst({where: {error_code: 1003}})
                return this.errorResponse(res, req, request_id, 403, {message: message['error_message'][headerData.lang], error_code: message['error_code']}, {steep:'sessions'} )
            }

            let sendParams = {
                uuid:headerData.uuid, sessionId:session_id
            };
            req.body = sendParams
            
            let sign = await RSA.rsaSign(sendParams, privateKey)

            let sendHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'sessions', "DELETE", sendParams, sendHeaders,req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async createuserData(data: UpdateUserDataDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            let { email, firstname, lastname, surname, checkphoto } = data
            request_id = new Date().getTime() + headerData.uuid
            
            let formdata = new FormData
            formdata.append('uuid', headerData.uuid || "")
            formdata.append('email', email || "")
            formdata.append('firstname', firstname || "")
            formdata.append('lastname', lastname || "")
            formdata.append('surname', surname || "")
            formdata.append('checkphoto', checkphoto || "")
            
            let sendParams = {
                uuid:headerData.uuid, email, firstname, lastname, surname, checkphoto
            }
            console.log(req['file']);
            req.body = data
            let sign = await RSA.rsaSign(sendParams, privateKey)
            let FormDataheaders = formdata.getHeaders();
            let sendHeaders = {
                sign,...FormDataheaders, request_id, ...headerData, 
            }

            if(req['file']?.buffer){
                formdata.append('image', req['file']['buffer'], req['file']['originalname'])
                let response = await RequestHelper.httpFormDataRequest(this.URL, 'userdata', "POST", formdata, sendHeaders,req)
                return res.status(response.status).json(response.data) 
            }
            
            let response = await RequestHelper.httpRequest(this.URL, 'userdata', "POST", sendParams, sendHeaders,req)
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async getquestions(params, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            let { type } = params
            request_id = new Date().getTime().toString() 

            let sendParams = {
                type
            };
            let sign = await RSA.rsaSign(sendParams, privateKey)
            let sendHeaders = {
                sign, ...headerData, request_id
            }
            let response = await RequestHelper.httpRequest(this.URL, 'questions/'+ type, "GET", sendParams, sendHeaders,req)

            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async getCourse(params, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            let { type } = params
            request_id = new Date().getTime().toString() 

            let sendParams = {
                type
            };
            let sign = await RSA.rsaSign(sendParams, privateKey)
            let sendHeaders = {
                sign, ...headerData, request_id
            }
            let response = await RequestHelper.httpRequest(this.URL, 'course/'+ type, "GET", sendParams, sendHeaders,req)
            if(response.data.data?.course.length){
                let formattedCourse = Helper.formattedCoruse(response.data.data?.course, type)
                response.data.data.course = formattedCourse
            }
            
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async contacts(body: footerDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        try {
            let { phone_numbers, social_media } = body
            let uuid = headerData.uuid
            request_id = new Date().getTime() + uuid 
            let response:any

            if(phone_numbers){
                response = await this.prisma.settings.update({
                    where:{
                        id:1
                    },
                    data:{
                        phone_numbers
                    }
                })
            }else if(social_media){
                response = await this.prisma.settings.update({
                    where:{
                        id:1
                    },
                    data:{
                        social_media
                    }
                })
            }
            
            return this.response(res, req, request_id, 200, {data:response},{})
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async getContacts(res:Response, req:Request):Promise<any>{
        let request_id
        try {
            request_id = new Date().getTime().toString()

            let response = await this.prisma.settings.findFirst()
            
            return this.response(res, req, request_id, 200, {data:response},{})
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }
    
    async checkPassport(data:UuidDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid || data?.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            request_id = new Date().getTime().toString() + headerData.uuid || data.uuid
            
            let sendParams = {
                uuid:headerData.uuid || data.uuid
            }
            
            let sign = await RSA.rsaSign(sendParams, privateKey)
            let sendHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'passportCheck', "POST", sendParams, sendHeaders,req)
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async addPassport(data: PassportDataDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            let { surname, type, name, middleName, serie, number, givenBy, givenDate, inn, pinfl, country, region, address, birthPlace, birthDate, expireDate } = data
            request_id = new Date().getTime() + headerData.uuid
            
            
            let formdata = new FormData
            formdata.append('uuid', headerData.uuid || "")
            formdata.append('surname', surname || "")
            formdata.append('type', type || "")
            formdata.append('name', name || "")
            formdata.append('middleName', middleName || "")
            formdata.append('serie', serie || "")
            formdata.append('number', number || "")
            formdata.append('givenBy', givenBy || "")
            formdata.append('givenDate', givenDate || "")
            formdata.append('inn', inn || "")
            formdata.append('pinfl', pinfl || "")
            formdata.append('country', country || "")
            formdata.append('region', region || "")
            formdata.append('address', address || "")
            formdata.append('birthPlace', birthPlace || "")
            formdata.append('birthDate', birthDate || "")
            formdata.append('expireDate', expireDate || "")
            
            let sendParams = {
                uuid:headerData.uuid, surname, type, name, middleName, serie, number, givenBy, givenDate, inn, pinfl, country, region, address, birthPlace, birthDate, expireDate 
            }

            req.body = data
            
            let sign = await RSA.rsaSign(sendParams, privateKey)
            let FormDataheaders = formdata.getHeaders();
            
            let sendHeaders = {
                sign,...FormDataheaders, request_id, ...headerData, 
            }
            console.log(req['files'])
            if(req['files'].length == 3){
                req['files'].forEach(file => {
                    formdata.append('image', file['buffer'], file['originalname'])
                });
                let response = await RequestHelper.httpFormDataRequest(this.URL, 'passport', "POST", formdata, sendHeaders,req)
                return res.status(response.status).json(response.data) 
            } else return this.RES.error_message(1006, headerData.lang, headerData.uuid)

        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }
    
    async updatePassport(param:paramPassportId, data: UpdatePassportDataDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            let { surname, type, name, middleName, serie, number, givenBy, givenDate, inn, pinfl, country, region, address, birthPlace, birthDate, expireDate } = data
            request_id = new Date().getTime() + headerData.uuid
            
            
            let formdata = new FormData
            formdata.append('uuid', headerData.uuid || "")
            formdata.append('id', param?.passportId || data.id)
            formdata.append('surname', surname || "")
            formdata.append('type', type || "")
            formdata.append('name', name || "")
            formdata.append('middleName', middleName || "")
            formdata.append('serie', serie || "")
            formdata.append('number', number || "")
            formdata.append('givenBy', givenBy || "")
            formdata.append('givenDate', givenDate || "")
            formdata.append('inn', inn || "")
            formdata.append('pinfl', pinfl || "")
            formdata.append('country', country || "")
            formdata.append('region', region || "")
            formdata.append('address', address || "")
            formdata.append('birthPlace', birthPlace || "")
            formdata.append('birthDate', birthDate || "")
            formdata.append('expireDate', expireDate || "")
            
            let sendParams = {
                uuid:headerData.uuid, id: param?.passportId || data.id, surname, type, name, middleName, serie, number, givenBy, givenDate, inn, pinfl, country, region, address, birthPlace, birthDate, expireDate 
            }

            req.body = data
            let sign = await RSA.rsaSign(sendParams, privateKey)
            let FormDataheaders = formdata.getHeaders();
            
            let sendHeaders = {
                sign,...FormDataheaders, request_id, ...headerData, 
            }
            console.log(req['files'])
            if(req['files'].length == 3){
                req['files'].forEach(file => {
                    formdata.append(file['fieldname'], file['buffer'], file['originalname'])
                });
                let response = await RequestHelper.httpFormDataRequest(this.URL, 'passport', "PUT", formdata, sendHeaders,req)
                return res.status(response.status).json(response.data) 
            } else return this.RES.error_message(1006, headerData.lang, headerData.uuid)

        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }

    async getPassport(data: UuidDto, res:Response, req:Request):Promise<any>{
        let request_id:string
        let headerData = Helper.headerFormatted(req)
        let privateKey = await this.redis.get(headerData.uuid || data.uuid)
        if(!privateKey) return this.RES.setError(401, "error", res)
        try {
            request_id = new Date().getTime().toString()
            
            let sendParams = {
                uuid:headerData.uuid || data.uuid
            }
            
            let sign = await RSA.rsaSign(sendParams, privateKey)
            let sendHeaders = {
                sign, request_id, ...headerData
            }
            let response = await RequestHelper.httpRequest(this.URL, 'getPassport', "POST", sendParams, sendHeaders,req)
            return res.status(response.status).json(response.data) 
        } catch (error) {
            this.logs.errorlog(req, error, request_id ) 
            this.RES.setError(500, 'error', res)
        }
    }
    public async localizationCache () {
        this.cache = await this.prisma.message_list.findMany() 
    }

    response(res:Response, req:Request , request_id, status:number, data:any, action:any){
        res.setHeader('x-request-id', request_id)
        this.logs.log(req, request_id, data)
        return res.status(status).json({
            "data": data,
            "action": action
        })
    }

    errorResponse(res:Response, req:Request , request_id, status:number, data:any, action:any ){
        res.setHeader('x-request-id', request_id)
        this.logs.log(req, request_id, data)
        return res.status(status).json({
            "data": {},
            "action": action,
            "message": {
                "error_text": data.message,
                "error_code": data.error_code
            }
        })
    }
}
