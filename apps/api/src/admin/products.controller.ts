import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Admin Products")
@Controller("api/v1/admin/products")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list() {
    return this.products.list();
  }
  @Post()
  create(@Body() data: any) {
    return this.products.create(data);
  }
  @Put(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.products.update(id, data);
  }
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.products.remove(id);
  }
}