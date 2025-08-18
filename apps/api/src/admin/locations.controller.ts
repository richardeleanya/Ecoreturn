import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { LocationsService } from "./locations.service";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Admin Locations")
@Controller("api/v1/admin/locations")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiBearerAuth()
export class LocationsController {
  constructor(private readonly locations: LocationsService) {}

  @Get()
  list() {
    return this.locations.list();
  }
  @Post()
  create(@Body() data: any) {
    return this.locations.create(data);
  }
  @Put(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.locations.update(id, data);
  }
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.locations.remove(id);
  }
}