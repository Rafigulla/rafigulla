import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { sprintf } from 'sprintf-js'
import { resText } from './responseText';
import { getInfoDto } from './dto/getInfoDto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getPnfilDto } from './dto';
import { AppService } from 'src/app.service';

@Injectable()
export class CreditService {
    constructor(
        private prisma: PrismaService,
        private http: HttpService,
        private config: ConfigService,
        private logs: AppService
    ){}

    async getLoans(res:Response, req:Request):Promise<any>{
        let request_id:any
        try {
            request_id = new Date().getTime() + req['user']['uuid']
            let lang = req.headers['accept-language'] || 'ru'
            
            let loans = await this.prisma.credit.findMany()

            loans.map(el => {
                el.name = el.name[lang] 
                el.info = el.info[lang]
            })

            return this.response(res, req, request_id, 200, {result:loans}, {})
        } catch (error) {        
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal Server error",
                    "error_code": 500
                }
            }) 
        }
    }

    async getInfo(param: getInfoDto, res:Response, req:Request):Promise<any>{
        let request_id:any
        try {
            request_id = new Date().getTime() + req['user']['uuid']
            let lang = req.headers['accept-language'] || 'ru'

            let info = await this.prisma.creditInfo.findMany({ where: { creditId: +param['credit_id'] } })
            let loan = await this.prisma.credit.findUnique({ where: { id: +param['credit_id'] } })

            loan.name = loan.name[lang] 
            loan.info = loan.info[lang]

            info.map(el => {
                el.titles = el.titles[lang] 
                el.info = el.info[lang]
            })
            return this.response(res,req, request_id, 200, {result:loan,info:info}, {})
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal Server error",
                    "error_code": 500
                }
            }) 
        }
    }

    async getPnfil(body: getPnfilDto, res:Response, req:Request):Promise<any>{
        let request_id:any
        try {
            const { pnfil } = body
            // request_id = new Date().getTime() + req['user']['uuid']

            let dataUrl = this.config.get("GET_PNFIL_URL")
            let data = await this.http.get(dataUrl+pnfil).toPromise()
            

            if (data.data.resCode != 0) {
                return this.errorResponse(res, req, request_id, 403, {message:"Шахсий маълумотлар топилмади. Маълумотларни текшириб қайта киритинг"}, {steep: 'home'})
            }
            
            return this.response(res, req, request_id, 200, {data: data.data.clientInfo}, {})
        } catch (error) {
            this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal Server error",
                    "error_code": 500
                }
            }) 
        }
    }

    private response(res:Response, req:Request , request_id, status:number, data:any, action:any){
        res.setHeader('x-request-id', request_id)
        this.logs.log(req, request_id, data)
        return res.status(status).json({
            "data": data,
            "action": action
        })
    }

    private errorResponse(res:Response, req:Request , request_id, status:number, data:any, action:any ){
        res.setHeader('x-request-id', request_id)
        this.logs.log(req, request_id, data)
        return res.status(status).json({
            "data": {},
            "action": action,
            "message": {
                "error_text": data.message,
                "error_code": status
            }
        })
    }
}
