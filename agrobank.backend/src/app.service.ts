import { HttpService } from '@nestjs/axios';
import { Injectable, Logger} from '@nestjs/common';
import { Request, Response } from 'express';
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
    constructor(
        private http: HttpService,
        private prisma: PrismaService
    ){}
    private logger: Logger = new Logger('AppService');

  async log(req: Request, request_id: string, response){ 
      let d = new Date()
      let date = new Date(d).toLocaleString('uz-UZ')
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let day = d.getDate().toString().padStart(2,'0')
      let hour = d.getHours() 
      let today = d.toDateString()

      let path = req.route.path 
      let method = req.method
      let ip = req.ip
      let userAgent = req.headers['user-agent']
      let body = JSON.stringify(req.body)

      
      if(!existsSync(`logs/logs/${year}/${month}/${day}`)){
          mkdirSync(`logs/logs/${year}/${month}/${day}`, {recursive: true});
      }
      let log = date+' RequestId: '+ request_id +' IP: '+ip+' Path: '+path+' Method: '+method+' Body: '+body+' Device: '+userAgent+'---> Response '+JSON.stringify(response)+'\n'
      this.logger.log(log)
      appendFileSync(join(process.cwd(),`logs/logs/${year}/${month}/${day}/${hour}_${day}-${month}-${year}.log`), log )
  }

  async errorlog(req: Request, error, request_id:string){

      let d = new Date()
      let date = new Date(d).toLocaleString('uz-UZ')
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let day = d.getDate().toString().padStart(2,'0')
      let hour = d.getHours() 

      let path = req.route.path 
      let method = req.method
      let ip = req.ip
      let userAgent = req.headers['user-agent']
      let body = JSON.stringify(req.body)

      if(!existsSync(`logs/errorlogs/${year}/${month}/${day}`)){
          mkdirSync(`logs/errorlogs/${year}/${month}/${day}`, {recursive: true});
      }
      let log = date+' RequestId: '+ request_id +' IP: '+ip+' Path: '+path+' Method: '+method+' Body: '+body+' Device: '+userAgent+' ---> Error: '+error.message+'\n'
      appendFileSync(join(process.cwd(),`logs/errorlogs/${year}/${month}/${day}/${hour}_${day}-${month}-${year}.log`), log )

      this.logger.log(log)
      try {
        await this.http.get(`https://api.telegram.org/bot5057668685:AAFc4ELEfQFSHYQKA6aeTs2lpEtCrhafdo4/sendMessage?chat_id=887528138&text=request_id: ${request_id} \n Error:`+error).toPromise()
      } catch (err) {
      }
  }

  async getlogs(body:any){
    try {
        const { errorlogs, logs, year, month, date, file } = body
        
        const getDirectories = source =>
        readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory() || dirent.isFile())
            .map(dirent => dirent.name)

        let folders = getDirectories(join(process.cwd(), 'logs')) 
        if(errorlogs && year && month && date && file){
            folders = [readFileSync(join(process.cwd(), 'logs', 'errorlogs', year, month, date, file ), 'utf-8')]
        } else if(errorlogs && year && month && date){
            folders = getDirectories(join(process.cwd(), 'logs', 'errorlogs', year, month, date))
        } else if(errorlogs && year && month){
            folders = getDirectories(join(process.cwd(), 'logs', 'errorlogs', year, month))
        } else if (errorlogs && year){
            folders = getDirectories(join(process.cwd(), 'logs', 'errorlogs', year))
        } else if (errorlogs){
            folders = getDirectories(join(process.cwd(), 'logs', 'errorlogs' ))
        } else if(logs && year && month && date && file){
            folders = [readFileSync(join(process.cwd(), 'logs', 'logs', year, month, date, file ), 'utf-8')]
        } else if (logs && year && month && date){
            folders = getDirectories(join(process.cwd(), 'logs', 'logs', year, month, date))
        } else if (logs && year && month ){
            folders = getDirectories(join(process.cwd(), 'logs', 'logs', year, month ))
        } else if (logs && year ){
            folders = getDirectories(join(process.cwd(), 'logs', 'logs', year ))
        } else if (logs ){
            folders = getDirectories(join(process.cwd(), 'logs', 'logs' ))
        } 
        
        return folders
        
    } catch (error) {
        
    }
  }
}

