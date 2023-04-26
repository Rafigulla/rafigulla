import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto'
import { AppService } from 'src/app.service';
import { Request } from 'express';
import RSA from './Rsa.helper';
import Helper from './helper';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common';
import { ResponseHelper } from './response';
let http = new HttpService;

class RequestHelper {
    static logger: Logger = new Logger('HttpRequest');
    static RES: ResponseHelper
    static async httpRequest(URL:string, PATH: string, METHOD:string, data, setheaders, req: Request, checkResponse: boolean = true): Promise<any> {
        let d = new Date()
        let date = new Date(d).toLocaleString('uz-UZ')
        
        let headerData = {
            'x-model': setheaders.device,
            'x-device-id': setheaders.device_id,
            'x-os': setheaders?.os || 'MaxOS',
            'authorization': setheaders.token, 
            'x-os-version': setheaders.os_version,
            'x-app-version': setheaders.app_version,
            'x-latlong': setheaders.location,
            'ip_adress': setheaders.ip_adress,
            'x-request-id': setheaders.request_id,
            'x-sign': setheaders.sign, 
            'lang': setheaders?.lang || 'ru',
            'Content-Type': 'application/json',
        };
        this.logger.log("headerData",headerData)
        let responseData: any
        try {
            let respData:any
            if (METHOD == 'GET') {
                respData = await http.get(URL + PATH, {headers: headerData}).toPromise();
            } else if (METHOD.toLocaleUpperCase() == 'POST'){
                respData = await http.post(URL + PATH, data, {headers: headerData}).toPromise();
            } else if (METHOD.toLocaleUpperCase() == 'PUT'){
                respData = await http.put(URL + PATH, data, {headers: headerData}).toPromise();
            } else if (METHOD.toLocaleUpperCase() == 'DELETE'){
                respData = await http.delete(URL + PATH, {data, headers: headerData}).toPromise();
            }
            responseData = {status: respData.status, data: respData.data}    
            if (checkResponse) {
                let is_valid = await RSA.rsaVerify(respData.data?.data, respData.headers?.sign)        
                if(!is_valid) return this.RES.error_message(1005, setheaders.lang, data.uuid || '')
            }      
        } catch (e) {
            responseData = {status: e.response.status, data: e.response.data}
        }
        let log = date+' RequestId: '+ setheaders.request_id +' IP: '+setheaders.ip_adress+' Path: '+req.path+' Method: '+req.method+' Body: '+JSON.stringify(req.body)+' Device: '+setheaders.device+'---> Response '+JSON.stringify(responseData)+'\n'
        this.logger.log(log)
		return responseData
    } 

    static async httpFormDataRequest(URL:string, PATH: string, METHOD:string, data, setheaders, req: Request, checkResponse: boolean = true){
        let d = new Date()
        let date = new Date(d).toLocaleString('uz-UZ')
        
        let headerData = {
            'x-model': setheaders.device,
            'x-device-id': setheaders.device_id,
            'x-os': setheaders?.os || 'MaxOS',
            'authorization': setheaders.token, 
            'x-os-version': setheaders.os_version,
            'x-app-version': setheaders.app_version,
            'x-latlong': setheaders.location,
            'ip_adress': setheaders.ip_adress,
            'x-request-id': setheaders.request_id,
            'x-sign': setheaders.sign, 
            'lang': setheaders?.lang || 'ru',
            'Content-Type': setheaders['content-type'],
        };
        this.logger.log("headerData",headerData)
        let responseData:any
        try {
            let respData: any
            if (METHOD.toUpperCase() == "POST") {
                respData = await http.post(URL+PATH, data, {headers:headerData}).toPromise()
            } else if (METHOD.toUpperCase() == "PUT"){
                respData = await http.put(URL+PATH, data, {headers:headerData}).toPromise()   
            }
            responseData = {status: respData.status, data: respData.data}  
        } catch (e) {
            // console.log('error', e);
            
            responseData = {status: e.response.status, data: e.response.data}
        }
        console.log('responseData', responseData);
        
        let log = date+' RequestId: '+ setheaders.request_id +' IP: '+setheaders.ip_adress+' Path: '+req.path+' Method: '+req.method+' Body: '+JSON.stringify(req.body)+' Device: '+setheaders.device+'---> Response '+JSON.stringify(responseData)+'\n'
        this.logger.log(log)
		return responseData
    }
}

export default RequestHelper