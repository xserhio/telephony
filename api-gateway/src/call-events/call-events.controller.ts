import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CallEventsService } from './call-events.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetAllEventsQueryDto } from './dto/get-all-events.req.dto';
@Controller('call-events')
export class CallEventsController {
  constructor(private callEventsService: CallEventsService) {}

  @UseGuards(AuthGuard)
  @Get('/get-all')
  async getAll(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    { startDate, endDate }: GetAllEventsQueryDto,
  ) {
    const user = request['user'];

    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.callEventsService.getAll(
      user.username,
      startDate,
      endDate,
    );
  }
}
