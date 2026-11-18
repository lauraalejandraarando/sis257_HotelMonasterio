import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { HuespedesService } from './huespedes.service';
import { CreateHuespedDto } from './dto/create-huesped.dto';
import { UpdateHuespedDto } from './dto/update-huesped.dto';

// Modificado por Brayan
@ApiTags('Huespedes')
@Controller('huespedes')
export class HuespedesController {
  constructor(private readonly huespedesService: HuespedesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar huespedes' })
  findAll() {
    return this.huespedesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar huesped por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.huespedesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar huesped' })
  create(@Body() data: CreateHuespedDto) {
    return this.huespedesService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar huesped' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateHuespedDto,
  ) {
    return this.huespedesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar huesped' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.huespedesService.remove(id);
  }
}