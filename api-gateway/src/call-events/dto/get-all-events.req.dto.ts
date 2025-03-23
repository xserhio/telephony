import { IsDateString, IsOptional } from 'class-validator';

export class GetAllEventsQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
