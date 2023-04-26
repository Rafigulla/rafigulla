import {BadRequestException, Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import * as https from "https";
import {v4 as uuidv4} from "uuid";
import {PrismaService} from "./prisma/prisma.service";
import { historyUzcardDto } from "./dto/historyUzcadDto";
import { historyDto } from "./dto/historyDto";
import { historyGroupDto } from "./dto/historyGroupCard";


@Injectable()
export class AppService {
    constructor(
        private readonly http: HttpService,
        private prisma: PrismaService
    ) {

    }

    private readonly infoUrl = "http://192.168.10.12:50443/v1/ws/transaction-history";
    private readonly iiacsUrl = "http://192.168.10.12:50443/v3/iiacs/card";
    private readonly customerUrl = "http://192.168.10.12:50443/v2/mb/customer-list";

    private readonly historyUzUrl = "http://192.168.10.8:47777/api/jsonrpc"

    async iiacs(card_number) {
        let payload = {
            "id": uuidv4(),
            "params": {
                "primaryAccountNumber": card_number,
                "mb_flag": 1
            }
        };
        let response = await this.fire(payload, this.iiacsUrl, true);
        if (response.status == 200) {
            let result = await this.iiacsCollector(response.data);
            return result
        } else {
            let obj = {
                "card_number": card_number,
                "status": response.data.error.message,
            }
            return obj
        }

    }

    async customer_list(phone) {
        let payload = {
            "id": uuidv4(),
            "params": {
                "phone": phone,
                "bankId": "MB_STD"
            }
        };
        let response = await this.fire(payload, this.customerUrl);
        // return response
        let collect = [];
        for (const i of response.result.Customer) {
            for (const iElement of i.Card) {
                let obj = await this.iiacs(iElement.pan);
                collect.push(obj);
            }
        }
        return collect;
    }

    async history_humo(body:historyDto):Promise<any> {
       try {
            let { card_number, date_from, date_to, page, limit } = body
            let start_date = new Date(`${date_from}T00:00:00`).getTime().toString()
            let end_date = new Date(`${date_to}T23:59:59`).getTime().toString()
            
            if(new Date(`${date_to}T00:00:00`).getDate() > new Date().getDate()){
                return new BadRequestException('Указанная дата больше, чем сегодня')
            }
            else if(+end_date > (new Date().getTime())) {
                end_date = new Date().getTime().toString() 
            }

            let card = await this.prisma.cards.findFirst({
                where: {
                    card: card_number
                }
            });
            console.log('86', card);
            
            if (card) {
                if (start_date >= card.start_date && end_date <= card.end_date) {   
                    console.log('90', start_date);
                      
                    return await this.DataBaseHumo(card_number, date_from, date_to, page, limit)
                } else if (start_date < card.start_date && end_date > card.end_date) {
                    console.log('94', start_date);
                    let start_date_data = await this.payload(card_number, date_from, card.start_date_format);    
                    let end_date_data = await this.payload(card_number, card.end_date_format, date_to);
                    
                    let response1 = await this.fire(start_date_data, this.infoUrl, true); 
                    let response2 = await this.fire(end_date_data, this.infoUrl, true);
    
                    let array = []
                    let array2 = []

                    if(response1.data?.result){
                        array = await this.collector_with_data(response1);
                    }
                    if(response2.data?.result){
                        array2 = await this.collector_with_data(response2)
                    } else {
                        return new BadRequestException(response1.data.error.message)
                    }

                    for (const cardInfo of [...array, ...array2]) {
                        await this.prisma.humo.create({
                            data: {
                                card: card_number,
                                tran_date: new Date(cardInfo.TRAN_DATE_TIME),
                                data: cardInfo
                            }
                        });
                    }

                    await this.prisma.cards.updateMany({
                        where:{
                            card:card.card
                        },
                        data:{
                            start_date,
                            end_date,
                            start_date_format: date_from,
                            end_date_format: date_to
                        }
                    })

                    return await this.DataBaseHumo(card_number, date_from, date_to, page, limit);
                } else if (start_date < card.start_date) {
                    let payload = await this.payload(card_number, date_from, card.start_date_format);
                    // return payload
                    let response = await this.fire(payload, this.infoUrl, true);
                    // return response
                    console.log('141', response);
                    
                    let array = []
                    if(response.data?.result){
                        array = await this.collector_with_data(response);
                    } else {
                        return new BadRequestException(response.data.error.message)
                    }

                    for (const cardInfo of array) {
                        await this.prisma.humo.create({
                            data: {
                                card: card_number,
                                tran_date: new Date(cardInfo.TRAN_DATE_TIME),
                                data: cardInfo
                            }
                        });
                    }

                    await this.prisma.cards.updateMany({
                        where:{
                            card:card.card
                        },
                        data:{
                            start_date,
                            start_date_format: date_from
                        }
                    })
                    return await this.DataBaseHumo(card_number, date_from, date_to, page, limit);
                } else if (end_date > card.end_date) {
                    
                    
                    let payload = await this.payload(card_number, card.end_date_format, date_to);
                    let response = await this.fire(payload, this.infoUrl, true);
                    console.log('175', response);
                    let array = []
                    if(response.data?.result){
                        array = await this.collector_with_data(response);
                    }

                    for (const cardInfo of array) {
                        await this.prisma.humo.create({
                            data: {
                                card: card_number,
                                tran_date: new Date(cardInfo.TRAN_DATE_TIME),
                                data: cardInfo
                            }
                        });
                    }
                    await this.prisma.cards.updateMany({
                        where:{
                            card:card.card
                        },
                        data:{
                            end_date,
                            end_date_format: date_to
                        }
                    })
                    return await this.DataBaseHumo(card_number, date_from, date_to, page, limit);
                }
            } else {
                let payload = await this.payload(card_number, date_from, date_to);                
                // return payload
                let response = await this.fire(payload, this.infoUrl, true);
                console.log('201', response);
                
                // return response
                let array = []
                
                if(response.data?.result){
                    array = await this.collector_with_data(response);
                } else {
                    return new BadRequestException(response.data.error.message)
                }

                if(response.data?.result) await this.prisma.cards.create({ data: {card: card_number, start_date, end_date, start_date_format:date_from, end_date_format:date_to, card_type:'humo' }})

                for (const cardInfo of array) {
                    await this.prisma.humo.create({
                        data: {
                            card: card_number,
                            tran_date: new Date(cardInfo.TRAN_DATE_TIME),
                            data: cardInfo
                        }
                    });
                }
                
                return await this.DataBaseHumo(card_number, date_from, date_to, page, limit);
            }
       } catch (error) {
            console.log('231', error);
            
            return new BadRequestException(error.message)
       }

    }

    async history_uz(body:historyUzcardDto):Promise<any> {
        try {
            let  { card_token, date_to, date_from, page, limit } = body
            let start_date = new Date(`${date_from}T00:00:00`).getTime().toString()
            let end_date = new Date(`${date_to}T23:59:59`).getTime().toString()

            if(new Date(`${date_to}T00:00:00`).getDate() > new Date().getDate()){
                return new BadRequestException('Указанная дата больше, чем сегодня')
            }
            else if(+end_date > (new Date().getTime())) {
                end_date = new Date().getTime().toString() 
            }
            
            let dateTo = date_to.split('-').join('')
            let dateFrom = date_from.split('-').join('')

            let card = await this.prisma.cards.findFirst({
                where: {
                    card: card_token
                }
            });

            if (card) {
                
                if (start_date >= card.start_date && end_date <= card.end_date) {
                    return await this.DataBaseUzCard(card_token, date_from, date_to, page, limit)
                } else if (start_date < card.start_date && end_date > card.end_date) {
                    let _date_to =  card.start_date_format.split('-').join('')
                    let _date_from =  card.end_date_format.split('-').join('')

                    let start_date_data = this.payload_uz(card_token, dateFrom, _date_to, 0)
                    let end_date_data = this.payload_uz(card_token, _date_from, dateTo, 0)
                    
                    let response1 = await this.fire_uz(start_date_data, this.historyUzUrl)
                    let response2 = await this.fire_uz(end_date_data, this.historyUzUrl)

                    if(response1?.error) throw new BadRequestException(response1?.error.message)
                    if (response1?.result?.content.length == 0 && response2?.result?.content.length == 0)  return []
                    let totalPages = response1.result.totalPages + response2.result.totalPages

                    let dataList = []
                    for (let i = 0; i <= totalPages; i++) {
                        let start_date = this.payload_uz(card_token, dateFrom, _date_to, i)
                        let end_date = this.payload_uz(card_token, _date_from, dateTo, i)

                        let response1 = await this.fire_uz(start_date, this.historyUzUrl)
                        let response2 = await this.fire_uz(end_date, this.historyUzUrl)

                        let new_content1 = await response1.result.content
                        let new_content2 = await response2.result.content
                        dataList.push(...new_content1, ...new_content2)
                    }
                    
                    for (const cardInfo of dataList) {
                        let date = this.debugger_date(cardInfo.udate, cardInfo.utime).toString()
                        let t = date.split('')
        
                        let date_formatted = t[0]+t[1]+t[2]+t[3]+'-'+t[4]+t[5]+'-'+t[6]+t[7]+'T'
                                    +t[8]+t[9]+':'+t[10]+t[11]+':'+t[12]+t[13]                      // string time to DateTime format conver
        
                        await this.prisma.uzcard.create({
                            data: {
                                card: card_token,
                                tran_date: new Date(date_formatted),
                                data: cardInfo
                            }
                        });
                    }

                    await this.prisma.cards.updateMany({
                        where:{
                            card:card.card
                        },
                        data:{
                            start_date,
                            end_date,
                            start_date_format: date_from,
                            end_date_format: date_to
                        }
                    })
                    // // await this.uzHistory(card_token, date_from, date_to)
                    
                    return await this.DataBaseUzCard(card_token, date_from, date_to, page, limit);

                } else if (start_date < card.start_date) {
                    console.log("card");
                    let _date_to = card.start_date_format.split('-').join('')
                    let start_date_data = this.payload_uz(card_token, dateFrom, _date_to, 0)

                    let response = await this.fire_uz(start_date_data, this.historyUzUrl)

                    if(response?.error) throw new BadRequestException(response?.error.message)
                    if (response?.result?.content.length == 0 )  return []
                    let totalPages = response.result.totalPages 

                    let dataList = []
                    for (let i = 0; i <= totalPages; i++) {
                        let start_date = this.payload_uz(card_token, dateFrom, _date_to, i)

                        let response = await this.fire_uz(start_date, this.historyUzUrl)

                        let new_content1 = await response.result.content
                        dataList.push(...new_content1)
                    }

                    for (const cardInfo of dataList) {
                        let date = this.debugger_date(cardInfo.udate, cardInfo.utime).toString()
                        let t = date.split('')
        
                        let date_formatted = t[0]+t[1]+t[2]+t[3]+'-'+t[4]+t[5]+'-'+t[6]+t[7]+'T'
                                    +t[8]+t[9]+':'+t[10]+t[11]+':'+t[12]+t[13]                      // string time to DateTime format conver
        
                        await this.prisma.uzcard.create({
                            data: {
                                card: card_token,
                                tran_date: new Date(date_formatted),
                                data: cardInfo
                            }
                        });
                    }
                    await this.prisma.cards.updateMany({
                        where:{
                            card:card.card
                        },
                        data:{
                            start_date,
                            start_date_format: date_from
                        }
                    })
                    // await this.uzHistory(card_token, date_from, date_to)
                    return await this.DataBaseUzCard(card_token, date_from, date_to, page, limit);
                } else if (end_date > card.end_date) {

                    let _date_from = card.end_date_format.split('-').join('')
                    let start_date = this.payload_uz(card_token, _date_from, dateTo, 0)

                    let response = await this.fire_uz(start_date, this.historyUzUrl)

                    if(response?.error) throw new BadRequestException(response?.error.message)
                    if (response?.result?.content.length == 0 )  return []
                    let totalPages = response.result.totalPages 

                    let dataList = []
                    for (let i = 0; i <= totalPages; i++) {
                        let start_date = this.payload_uz(card_token, _date_from, dateTo, 1)

                        let response = await this.fire_uz(start_date, this.historyUzUrl)

                        let new_content1 = await response.result.content
                        dataList.push(...new_content1)
                    }

                    for (const cardInfo of dataList) {
                        let date = this.debugger_date(cardInfo.udate, cardInfo.utime).toString()
                        let t = date.split('')
        
                        let date_formatted = t[0]+t[1]+t[2]+t[3]+'-'+t[4]+t[5]+'-'+t[6]+t[7]+'T'
                                    +t[8]+t[9]+':'+t[10]+t[11]+':'+t[12]+t[13]                      // string time to DateTime format conver
        
                        await this.prisma.uzcard.create({
                            data: {
                                card: card_token,
                                tran_date: new Date(date_formatted),
                                data: cardInfo
                            }
                        });
                    }
                    await this.prisma.cards.updateMany({
                        where:{
                            card:card.card
                        },
                        data:{
                            end_date,
                            end_date_format: date_to
                        }
                    })
                    // await this.uzHistory(card_token, date_from, date_to)
                    return await this.DataBaseUzCard(card_token, date_from, date_to, page, limit);
                } 
            } else {
                let payload = await this.payload_uz(card_token, dateFrom, dateTo, 0)
                let response = await this.fire_uz(payload, this.historyUzUrl)
                
                if(response?.error) throw new BadRequestException(response?.error.message)
                if (response?.result?.content.length == 0)  return []
                
                let totalPages =  response.result.totalPages
                
                let dataList = []
                for (let i = 0; i <= totalPages; i++) {
                    
                    let payload = await this.payload_uz(card_token, dateFrom, dateTo, i)
                    let new_res = await this.fire_uz(payload, this.historyUzUrl)
                    let new_content = await new_res.result.content
                    dataList.push(...new_content)
                }

                await this.prisma.cards.create({ data: {card: card_token, start_date, end_date, start_date_format:date_from, end_date_format:date_to,card_type:'uzcard' }})

                for (const cardInfo of dataList) {
                    let date = this.debugger_date(cardInfo.udate, cardInfo.utime).toString()
                    let t = date.split('')

                    let date_formatted = t[0]+t[1]+t[2]+t[3]+'-'+t[4]+t[5]+'-'+t[6]+t[7]+'T'
                                +t[8]+t[9]+':'+t[10]+t[11]+':'+t[12]+t[13]                      // string time to DateTime format conver

                    await this.prisma.uzcard.create({
                        data: {
                            card: card_token,
                            tran_date: new Date(date_formatted),
                            data: cardInfo
                        }
                    });
                }

                return await this.DataBaseUzCard(card_token, date_from, date_to, page, limit)
                
                // await this.prisma.uzcard.create({
                //     data: {
                //         data: JSON.stringify(old_data),
                //         updated_at: this.change_to_time_int(date_to)
                //     }
                // });
                // return await this.DataBaseUzCard(card_token, date_to, date_from, page, size)
            }

        } catch (error) {
            return new BadRequestException(error.message)
        }
        // return await this.DataBaseUzCard(card_token, date_to, date_from, page, size)
    }

    async group_card_history(body:historyGroupDto):Promise<any> {
        try {
            let { cards, date_from, date_to, page, limit } = body
            let cardList = await this.prisma.cards.findMany({select:{card:true}})
            console.log(cardList);
            
            for (const card of cards) {
                try {
                    if(card.length == 16) await this.history_humo({card_number:card, date_from, date_to, page, limit})
                    else await this.history_uz({card_token: card, date_from, date_to, page, limit})
                } catch (error) {}
            }   
            
            return await this.groupCardBase(cards, date_from, date_to, page, limit)
        } catch (error) {
            return new BadRequestException(error.message)
        }
        // for (let card of cards) {
        //     if (card.length == 16) {
        //         // return card
        //         let response = await this.history_humo(card, date_from, date_to, page, size)
        //         console.log(response)
        //         data.push(...response)
        //     } else {
        //         let response = await this.history_uz(card, date_to, date_from, page, size)
        //         data.push(...response)
        //     }
        // }
        // // return data
        // data.sort((a, b) => {
        //     // this.DateToInt(a.TRAN_DATE_TIME) + this.DateToInt(b.TRAN_DATE_TIME)
        //     if (a.TRAN_DATE_TIME > b.TRAN_DATE_TIME)
        //         return -1;
        //     if (a.TRAN_DATE_TIME < b.TRAN_DATE_TIME)
        //         return 1;
        //     return 0;
        // })
        // let result = data.slice(page * size - size, size * page);
        // return result
    }

    private async groupCardBase(cards, date_from, date_to, page, limit):Promise<any>{
        try {
            page = parseInt(page)
            limit = parseInt(limit)
            // page = _page != 1 ? (_page - 1) * _limit : _page

            let res_cards = await this.prisma.cards.findMany({where:{
                card:{
                    in: cards
                }
            }})
            let dataList = []
            let card_types = []
            for (const card of res_cards) {
                if(card.card_type == 'humo'){
                    card_types.push('humo')
                    let data = await this.prisma.humo.findMany({
                        where: {
                            card: card.card,
                            tran_date: {
                                lte: new Date(`${date_to}T23:59:59`),
                                gte: new Date(`${date_from}T00:00:00`)
                            }
                        },
                        select:{
                            data:true,
                            tran_date:true
                        },
                        orderBy: {
                            tran_date: 'asc'
                        }
                    })
                    dataList.push(...data.map(el => {
                        return {card: card.card,  card_type: card.card_type, t_date: new Date(el.tran_date).getTime(), data: el.data}
                    }))
                } else if(card.card_type == 'uzcard'){
                    card_types.push('uzcard')
                    let data = await this.prisma.uzcard.findMany({
                        where: {
                            card: card.card,
                            tran_date: {
                                lte: new Date(`${date_to}T23:59:59`),
                                gte: new Date(`${date_from}T00:00:00`)
                            }
                        },
                        select:{
                            data:true,
                            tran_date:true
                        },
                        orderBy: {
                            tran_date: 'asc'
                        }
                    })
                    dataList.push(...data.map(el => {
                        return {card: card.card,  card_type: card.card_type, t_date: new Date(el.tran_date).getTime(), data: el.data}
                    }))
                }
            }

            dataList = dataList.sort((a, b) => a.t_date - b.t_date)
            let totalElements = dataList.length
            let totalPages = (Math.ceil(totalElements / limit))
            let pagination = dataList.slice(page * limit - limit, limit * page)

            let obj = {
                cards: cards,
                card_types: card_types,
                totalElements,
                totalPages,
                element: pagination.length,
                page: page,
                limit: limit,
                lastPage: page >= totalPages ? true : false,
                data: pagination
            }


            return obj
        
            
            // for (const card of cards) {
            //     let data = await this.prisma[card.card_type].findMany({
            //         card: card.card,
            //         tran_date: {
            //             lte: new Date(`${date_to}T23:59:59`),
            //             gte: new Date(`${date_from}T00:00:00`)
            //         },
            //         select:{
            //             data:true
            //         },
            //         orderBy: {
            //             tran_date: 'asc'
            //         },
            //         skip: page,
            //         take: _limit,
                    
            //     })
                
            // }
       

        } catch (error) {
            
        }
    }
    
    private async DataBaseHumo(card_number, date_from, date_to, page, limit):Promise<any> {
        try {
            let _page = parseInt(page)
            let _limit = parseInt(limit)
            page = _page != 1 ? (_page - 1) * _limit : _page

            let totalElements = await this.prisma.humo.count({where:{
                card: card_number,
                tran_date: {
                    lte: new Date(`${date_to}T23:59:59`),
                    gte: new Date(`${date_from}T00:00:00`)
                }
            }})
            let totalPages = Math.ceil(totalElements / _limit)
            
            let card = await this.prisma.humo.findMany({
                where: {
                    card: card_number,
                    tran_date: {
                        lte: new Date(`${date_to}T23:59:59`),
                        gte: new Date(`${date_from}T00:00:00`)
                    }
                },
                select:{
                    data:true
                },
                orderBy: {
                    tran_date: 'asc'
                },
                skip: page,
                take: _limit
            })

            let obj = {
                card: card_number,
                card_type: 'humo',
                totalElements,
                totalPages,
                element: card.length,
                page: _page,
                limit: _limit,
                lastPage: _page >= totalPages ? true : false,
                data: card.map(el => el.data)
            }
            
            return obj
        } catch (error) {
            console.log(error);
            return error
            
        }
        // let select = JSON.parse(card.data);
        // let data = await select.filter((i) => (this.change_to_time_int(date_to) >= this.DateToInt(i.TRAN_DATE_TIME) &&
        //     this.change_to_time_int(date_from) <= this.DateToInt(i.TRAN_DATE_TIME)));
        // data.sort((a, b) => {
        //     // this.DateToInt(a.TRAN_DATE_TIME) + this.DateToInt(b.TRAN_DATE_TIME)
        //     if (a.TRAN_DATE_TIME > b.TRAN_DATE_TIME)
        //         return -1;
        //     if (a.TRAN_DATE_TIME < b.TRAN_DATE_TIME)
        //         return 1;
        //     return 0;
        // })
        // let result = await data.slice(page * limit - limit, limit * page);
        // // console.log(result)
        // return result;
    }

    private async DataBaseUzCard(card_token, date_from, date_to, page, limit):Promise<any> {
        try {
            let _page = parseInt(page)
            let _limit = parseInt(limit)
            page = _page != 1 ? (_page - 1) * _limit : _page

            let totalElements = await this.prisma.uzcard.count({where:{
                card: card_token,
                tran_date: {
                    lte: new Date(`${date_to}T23:59:59`),
                    gte: new Date(`${date_from}T00:00:00`)
                }
            }})

            let totalPages = Math.ceil(totalElements / _limit)

            let card = await this.prisma.uzcard.findMany({
                where: {
                    AND:{
                        card: card_token,
                        tran_date: {
                            lte: new Date(`${date_to}T23:59:59`),
                            gte: new Date(`${date_from}T00:00:00`)
                        }
                    }
                },
                select:{
                    data:true
                },
                orderBy: {
                    tran_date: 'asc'
                },
                skip: page,
                take: _limit,
            });
            
            let obj = {
                card: card_token,
                card_type: 'uzcard',
                totalElements,
                totalPages,
                element: card.length,
                page: _page,
                limit: _limit,
                lastPage: _page >= totalPages ? true : false,
                data: card.map(el => el.data)
            }
            
            return obj;
        } catch (error) {
            console.log(error);
            return error
        }
        // let select = JSON.parse(card.data);
        // let start_date = this.change_to_time_int(date_from)
        // let end_date = this.change_to_time_int(date_to)

        // let data = await select.filter((i) => start_date <= this.debugger_date(i.udate, i.utime) &&
        //     end_date >= this.debugger_date(i.udate, i.utime));
        // data.sort((a, b) => {
        //     // this.DateToInt(a.TRAN_DATE_TIME) + this.DateToInt(b.TRAN_DATE_TIME)
        //     if (a.TRAN_DATE_TIME > b.TRAN_DATE_TIME)
        //         return -1;
        //     if (a.TRAN_DATE_TIME < b.TRAN_DATE_TIME)
        //         return 1;
        //     return 0;
        // })
        // let result = await data.slice(page * size - size, size * page);
        
    }

    private async fire(payload, url, dragon = false) {
        if (dragon) {
            const response = await this.dragon(url, "POST", payload, {
                "Content-Type": "application/json",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDYxNWY4OTU3ZTk4YzAwMTJjOTI1YzkiLCJpYXQiOjE2MTk4NTcyNjJ9.egjIFW274SJFJv_0XGQqAY_i4DsIq55q9K2VX19-3GI"
            });
            console.log("kewjf lwekjfmlwekm", response);
            return response;
        } else {
            const response = await this.request(url, "POST", payload, {
                "Content-Type": "application/json",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDYxNWY4OTU3ZTk4YzAwMTJjOTI1YzkiLCJpYXQiOjE2MTk4NTcyNjJ9.egjIFW274SJFJv_0XGQqAY_i4DsIq55q9K2VX19-3GI"
            });
            console.log("kewjf lwekjfmlwekm", response);
            return response;
        }

    }

    private async fire_uz(payload, url, dragon = false) {
        if (dragon) {
            const response = await this.dragon(url, "POST", payload, {
                'Content-Type': 'application/json',
                'Authorization': 'Basic YWdyb2Jhbms6QXRQdCNnUn1XMEI4Z0F2djNuLUslYw=='
            },);
            // console.log("UzCard Fire Response", response);
            return response;
        } else {
            const response = await this.request(url, "POST", payload, {
                'Content-Type': 'application/json',
                'Authorization': 'Basic YWdyb2Jhbms6QXRQdCNnUn1XMEI4Z0F2djNuLUslYw=='
            },);
            // console.log("UzCard Fire Response", response);
            return response;
        }

    }

    // private async uzHistory(card_token, date_from, date_to) {
    //     let payload = await this.payload_uz(card_token, date_from, date_to, 0)
    //     let response = await this.fire_uz(payload, this.historyUzUrl)
    //     // return response
    //     let totalPages = await response.result.totalPages
    //     let content = await response.result.content
    //     let data_base = await this.prisma.uzcard.findFirst({
    //         where: {
    //             card_token: card_token
    //         }
    //     })
    //     let old_data = JSON.parse(data_base.data)
    //     old_data.push(...content)
    //     // return date_to
    //     await this.prisma.uzcard.updateMany({
    //         data: {
    //             updated_at: this.change_to_time_int(date_to),
    //             data: JSON.stringify(old_data)
    //         }
    //     });
    //     // return await this.DataBaseUzCard(card_token)
    //     for (let i = 1; i <= totalPages; i++) {
    //         let payload = await this.payload_uz(card_token, date_from, date_to, i)
    //         let new_res = await this.fire_uz(payload, this.historyUzUrl)
    //         let new_content = await new_res.result.content
    //         let data_base = await this.prisma.uzcard.findFirst({
    //             where: {
    //                 card_token: card_token
    //             }
    //         })
    //         let old_data = JSON.parse(data_base.data)
    //         old_data.push(...new_content)
    //         await this.prisma.uzcard.updateMany({
    //             where: {
    //                 card_token: card_token
    //             },
    //             data: {
    //                 data: JSON.stringify(old_data),
    //                 updated_at: this.change_to_time_int(date_to)
    //             }

    //         });
    //     }
    // }

    // private dateTime() {
    //     let date = new Date();
    //     let today =
    //         date.toLocaleDateString("uz-UZ", {year: "numeric", month: "numeric", day: "numeric"})
    //             .split("/")
    //             .reverse()
    //             .join("-") + "T" +
    //         date.toLocaleTimeString("uz-UZ", {hour12: false});
    //     return today;
    // }

    private async payload(card_number, date_from, date_to) {
        const payload = {
            id: uuidv4(),
            params: {
                pan: card_number,
                dateFrom: `${date_from}T00:00:00`,
                dateTo: `${date_to}T23:59:59`
            }
        };
        return payload;
    }

    private payload_uz(card_token, date_from, date_to, page) {
        const payload = JSON.stringify({
            "jsonrpc": "2.0",
            "method": "trans.history",
            "id": uuidv4(),
            "params": {
                "criteria": {
                    "cardIds": [
                        card_token
                    ],
                    "range": {
                        "startDate": date_from ,
                        "endDate": date_to
                    },
                    "pageNumber": page,
                    "pageSize": 50
                }
            }
        })
        return payload;
    }

    // private async collector(response) {
    //     let collect = response.result.rows.map((i) => {
    //         return i;
    //     });
    //     return collect;
    // }

    private async collector_with_data(response) {
        let collect = response.data.result.rows.map((i) => {
            return i;
        });
        return collect;
    }
    private async iiacsCollector(response) {
        let collect = {
            "bank": response.result.card.institutionId,
            "card_number": response.result.card.primaryAccountNumber,
            "expire": response.result.card.expiry,
            "owner": response.result.card.nameOnCard,
            "status": response.result.card.statuses.item[0].actionDescription,
            "balance": response.result.balance.availableAmount
        };
        return collect;
    }

    private debugger_date(date, time) {
        if (time.toString().length == 6) {
            return `${date}${time}`
        } else if (time.toString().length == 5) {
            return parseInt(`${date}0${time}`)
        } else if (time.toString().length == 4) {
            return parseInt(`${date}00${time}`)
        } else if (time.toString().length == 3) {
            return parseInt(`${date}000${time}`)
        } else if (time.toString().length == 2) {
            return parseInt(`${date}0000${time}`)
        } else if (time.toString().length == 1) {
            return parseInt(`${date}00000${time}`)
        } else {
            return date + '000000'
        }
    }

    // private StringToDate(dateString) {
    //     dateString = dateString.toString();
    //     // let year = dateString.slice(0, 4);
    //     // let month = dateString.slice(4, 6);
    //     // let day = dateString.slice(6, 8);
    //     let date = `${dateString}T23:59:59`;
    //     return date;
    // }

    // 2022-12-08T12:08:05
    // private DateToInt(tran_time) {
    //     tran_time = tran_time.toString();
    //     let year = tran_time.slice(0, 4);
    //     let month = tran_time.slice(5, 7);
    //     let day = tran_time.slice(8, 10);
    //     let hour = tran_time.slice(11, 13);
    //     let min = tran_time.slice(14, 16);
    //     let sec = tran_time.slice(17, 19);
    //     let date_int = `${year}${month}${day}${hour}${min}${sec}`;
    //     return parseInt(date_int);
    // }

    // private change_to_time_int(date) {
    //     date = date.toString();
    //     let date_int = date + '000000'
    //     return parseInt(date_int);
    // }

    private async request(url, method, data, headers: any = {}) {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });
        if (method.toUpperCase() == "GET") {
            try {
                let response = await this.http
                    .get(url, {headers, httpsAgent})
                    .toPromise();
                return response.data;
            } catch (e) {
                throw new BadRequestException(e.response);
            }
        } else if (method.toUpperCase() == "POST") {
            try {
                let response = await this.http
                    .post(url, data, {headers, httpsAgent})
                    .toPromise();
                return response.data;
            } catch (e) {
                // console.log("2222222", e.response);
                throw new BadRequestException(e.response.data);
            }
        }
    }


    private async dragon(url, method, data, headers: any = {}) {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });
        if (method.toUpperCase() == "GET") {
            try {
                let response = await this.http
                    .get(url, {headers, httpsAgent})
                    .toPromise();
                return response.data;
            } catch (e) {
                throw new BadRequestException(e.response);
            }
        } else if (method.toUpperCase() == "POST") {
            try {
                let response = await this.http
                    .post(url, data, {headers, httpsAgent})
                    .toPromise();
                return {data: response.data, "status": response.status};
            } catch (e) {
                // console.log("2222222", e.response);
                return {data: e.response.data, "status": e.response.status};
            }
        }
    }
}
