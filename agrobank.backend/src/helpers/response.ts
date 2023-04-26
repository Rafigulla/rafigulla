import { Global, HttpException, Injectable, Logger } from "@nestjs/common"
import { Response } from "express";
import { PrismaService } from "src/prisma/prisma.service"
const http = require('http')

@Global()
export class ResponseHelper {
    constructor(public prisma: PrismaService){}
    public logger: Logger = new Logger('SettingsService');
    public async error_message(error_code: number, lang:string, user_uuid:string, headerCode:number = 403):Promise<any>{
        let error_list = await this.prisma.error_list.findFirst({where: {error_code: error_code}})
        let error = error_list['error_message'][lang]
        this.logger.log('error', {
            data: {uuid: user_uuid},
            action: {},
            message: {error_text: error, error_code: error_code, error_type: 'error'}
        })
        throw new HttpException({
            data: {uuid: user_uuid},
            action: {},
            message: {error_text: error, error_code: error_code, error_type: 'error'}
        },headerCode)
    }

    public async setError(headerCode:number = 403, error_text:string = 'error', res?:Response,):Promise<any>{
        this.logger.log('error', {
            data: {},
            action: {},
            message: {error_text: error_text == 'error' ? http.STATUS_CODES[headerCode] : error_text, error_code: headerCode, error_type: 'http_error'}
        })
        if (res) {
            return res.status(headerCode).json({
                data: {},
                action: {},
                message: {error_text: error_text == 'error' ? http.STATUS_CODES[headerCode] : error_text, error_code: headerCode, error_type: 'http_error'}
            })
        }
        // throw new HttpException({
        //     data: {},
        //     action: {},
        //     message: {error_text: error_text == 'error' ? http.STATUS_CODES[headerCode] : error_text, error_code: headerCode, error_type: 'http_error'}
        // },headerCode)
    }
}