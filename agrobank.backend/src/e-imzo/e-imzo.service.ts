import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, response, Response } from 'express';
import { eImzoDto } from './dto/eimzo.dto';
import { xml2json } from 'xml-js';
import { parseString }  from 'xml2js'
import { AppService } from 'src/app.service';

@Injectable()
export class EImzoService {

    constructor(
        private config: ConfigService,
        private http: HttpService,
        private logs: AppService
    ){}

    async verifyHash(body :eImzoDto, res: Response, req: Request ):Promise<any>{
        let request_id:any
        try {
            const { uuid } = body
            const device = req.headers['user-agent']
            const lang = req.headers['accept-language']
            const token = req.headers['authorization']
            const ip_adress = req.ip
            request_id = new Date().getTime() + uuid

            let data = `
            <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                <Body>
                    <verifyPkcs7 xmlns="http://v1.pkcs7.plugin.server.dsv.eimzo.yt.uz/">
                        <pkcs7B64 xmlns="">
                        ${body.hash}
                        </pkcs7B64>
                    </verifyPkcs7>
                </Body>
            </Envelope>
            ` 
            let response = await this.httpRequest(data, req, request_id)
            let xml = response.data.data

            parseString(xml, (e, data) => {
                if (e) {
                    this.logs.errorlog(req, e, request_id)
                    throw new Error(e)
                }
                try { 
                    data = JSON.parse(data['S:Envelope']['S:Body'][0]['ns2:verifyPkcs7Response'][0]['return'][0])
                } catch (error) {
                    this.logs.errorlog(req, error, request_id)
                    throw new Error(e)
                }

                return res.status(200).json(data)
            })

        } catch (error) {
             this.logs.errorlog(req, error, request_id)
            return res.status(500).json({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Internal server error!",
                    "error_code": 500
                }
            })
        }
    }

    async httpRequest( data:any, req:Request , request_id): Promise<any> {

        let headerData = {
            'Content-Type': 'text/xml; charset=utf-8',
        };
        
        let responseData: any
        try {
            const respData = await this.http.post(this.config.get('E_IMZO_URL'), data, {headers: headerData}).toPromise();
            responseData = { data: {status: respData.status, data: respData.data}, responseHeader: respData.headers }    
        } catch (e) {
            responseData = { data: {status: e.response.status, data: e.response.data}, responseHeader: e.response.headers }
        }
        this.logs.log(req, request_id, responseData)
    
		return responseData
    }  

}
