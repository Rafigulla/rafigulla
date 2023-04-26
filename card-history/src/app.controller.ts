import { Body, Controller, Post } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions";
import { AppService } from './app.service';
import { historyDto } from "./dto/historyDto";
import { historyGroupDto } from "./dto/historyGroupCard";
import { historyUzcardDto } from "./dto/historyUzcadDto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('history')
  async history(@Body() body: historyDto) {

    if(+body.page <= 0){
      throw new BadRequestException('A page can accept a minimum of 1')
    }

    let response = await this.appService.history_humo(body);
    return response
  }

  @Post('iiacs')
  async iiacs(@Body() body) {
    let response = await this.appService.iiacs(
      body.card_number
    )
    return response
  }


  @Post('customer_list')
  async customer_list(@Body() body) {
    let response = await this.appService.customer_list(
      body.phone
    )
    return response
  }


  @Post('history_uz')
  async history_uz(@Body() body: historyUzcardDto) {
    if(+body.page <= 0){
      throw new BadRequestException('A page can accept a minimum of 1')
    }

    let response = await this.appService.history_uz(body);
    return response
  }


  @Post('group_card')
  async group_card_history(@Body() body:historyGroupDto) {
    if(+body.page <= 0){
      throw new BadRequestException('A page can accept a minimum of 1')
    }
    let response = await this.appService.group_card_history(body);
    return response
  }
  }