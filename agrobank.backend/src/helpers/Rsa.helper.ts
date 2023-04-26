import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto'
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/prisma/prisma.service';
let config = new ConfigService;
class RSA {
    static logger: Logger = new Logger('HttpRequest');

    static rsaSign (verifiableData:object, privateKey:string= ''):string{
        this.logger.log('verifiableData',verifiableData)
        this.logger.log('privateKey',privateKey)
        const signature = crypto.sign("sha256", Buffer.from(JSON.stringify(verifiableData)), {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
            // padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        });
        
        this.logger.log('sign',signature.toString('base64'))
        return signature.toString('base64')
    }

    static rsaVerify(data:any, sign:string):Boolean{
        try {
            let publicKey = config.get('PUBLIC_KEY')
            this.logger.log('verifyData',data)
            const isVerified = crypto.verify(
                "SHA256",
                Buffer.from(JSON.stringify(data)),
                {
                    key: publicKey,
                },
                Buffer.from(sign, 'base64')
            );
            return isVerified
        } catch (error) {
            console.log(error);
            return false
        }
   }
}

export default RSA