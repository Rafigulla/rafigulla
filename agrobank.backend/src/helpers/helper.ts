import { HttpException } from '@nestjs/common/exceptions';
import * as crypto from 'crypto'
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

class Helper {
    static parseRSA(publicKey: string, RsaKeyType: string) {
        let rsaWithoutHeaderAndFooter = publicKey.split(`-----BEGIN ${RsaKeyType} KEY-----`)[1].split(`-----END ${RsaKeyType} KEY-----`).join('');
        return this.replaceAll(rsaWithoutHeaderAndFooter, '\n', '');
    }

    static escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
      }
      
    static replaceAll(str, find, replace) {
        return str.replace(new RegExp(Helper.escapeRegExp(find), 'g'), replace);
    }

    static md5(string:string){
        return crypto.createHash('md5').update(string).digest('hex');
    }

    static headerFormatted(req: Request, is_public: Boolean = false){
        let uuid = req.headers['auth-user-uuid'] ? req.headers['auth-user-uuid'] : !is_public ? req['user']?.uuid: false || false
        console.log(uuid);
        let headers = req.headers
        let device = headers['user-agent'] || new Date().getTime().toString()
        let lang = headers['accept-language'] || 'ru'
        let location = headers['location'] || ''
        let token = headers['authorization']
        let ip_adress = req.ip
        let device_id = this.md5(device) 
        let os = headers['sec-ch-ua-platform'] || "Browser"
        let os_version = '10'
        let app_version = '10'

        if (uuid === false && is_public === false) {
            throw new HttpException({
                "data": {},
                "action": {},
                "message": {
                    "error_text": "Auth-User-UUID not found in headers",
                    "error_code": 403
            }}, 403)
        }
        
        
        return { device, lang, location, ip_adress, device_id, os, os_version, token, app_version, uuid:uuid?.toString() }
    }

    static formattedCoruse(list, type):Array<object>{
        if(type == 'cb'){
            let formattedCourse = list.map(el => {
                return {
                    'code': el['Code'],
                    'ccy': el['Ccy'],
                    'ccy_name_ru':el['CcyNm_RU'],
                    'ccy_name_en':el['CcyNm_EN'],
                    'ccy_name_uz':el['CcyNm_UZ'],
                    'ccy_name_uz_k':el['CcyNm_UZC'],
                    'nominal': el['Nominalw'],
                    'rate':el['Rate'],
                    'diff':el['Diff'],
                    'date':el['Date'],
                    'logo':el['logo'],
                    'show':el['show'],
                }
            })
            return formattedCourse
        } else if (type == 'agro'){
            let formattedCourse = list.map(el => {
                return {
                    'code': el['code'],
                    'ccy': el['ccy'],
                    'title': el['title'],
                    'nominal': el['nominal'],
                    'logo': el['logo'],
                    'buy': el['buy'],
                    'sale': el['sale'],
                    'show': el['show']
                }
            })
            return formattedCourse
        }
    } 
}

export default Helper;