import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

// Modificado por Brayan
@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar usuario' })
  crear(@Body() datos: CrearUsuarioDto) {
    return this.usuariosService.crear(datos);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios' })
  obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar usuario por ID' })
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.obtenerPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario y rol' })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarUsuarioDto,
  ) {
    return this.usuariosService.actualizar(id, datos);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar usuario' })
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.desactivar(id);
  }
}
