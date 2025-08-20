import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { BrandsService } from "./brands.service";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Admin Brands")
@Controller("api/v1/admin/brands")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiBearerAuth()
export class BrandsController {
  constructor(private readonly brands: BrandsService) {}

  @Get()
  list() {
    return this.brands.list();
  }
  @Post()
  create(@Body() data: any) {
    return this.brands.create(data);
  }
  @Put(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.brands.update(id, data);
  }
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.brands.remove(id);
  }
}