import { Controller, Get, Query, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Locations')
@Controller('api/v1/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('nearby')
  async nearby(@Query('lat') lat: number, @Query('lng') lng: number, @Query('radiusKm') radiusKm: number) {
    return this.locationsService.nearby(lat, lng, radiusKm);
  }

  @Get(':id')
  async byId(@Param('id') id: string) {
    return this.locationsService.byId(id);
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.locationsService.search(q);
  }
}