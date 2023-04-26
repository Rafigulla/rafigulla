import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from "@nestjs/common";
import { renderFile } from 'ejs'
import * as basicAuth from 'express-basic-auth';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.enableCors()
  app.enableCors({
    origin: [
      'http://192.168.10.73:5991',
      'http://localhost:5991'
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });

  app.engine('html', renderFile)
  app.setBaseViewsDir(join(__dirname, '../public'))
  app.setGlobalPrefix('new/my/api/');

  app.use((req, res, next)=>{
    let lang = req.headers['accept-language']
    if(true || ['uz', 'ru', 'en'].includes(lang)){
      next()
    } else {
      return res.status(403).json({
        "data": {},
        "action": {},
        "message": {
            "error_text": 'Language invalid',
            "error_code": 403
        }
    })
    }
  })

  app.use(['/new/my/api/swagger', '/new/my/api/v1/logpanel'], basicAuth({
    challenge: true,
    users: {
        myagrobankuz:"agrobankuz"
    }
  }))
  
  const options = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription('my.agrobank.uz api')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Please enter token in following format: Bearer <JWT>',
      type: 'http', 
      scheme: 'Bearer', 
      bearerFormat: 'Bearer',
      in: "Header"
    }, 'access_token')
    .build();

    app.useStaticAssets(join(__dirname, '../logs'), {
      index: false,
      redirect: false
    })
    
    app.useStaticAssets(join(__dirname, '../files'), {
      index: false,
      redirect: false
    })
    
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('new/my/api/swagger',app,document);

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));


  await app.listen(30003);
}
bootstrap();


