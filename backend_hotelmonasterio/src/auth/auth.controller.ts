
import {
  Controller,
  Post,
  Body,
  Req,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import type { Request } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { Public } from './public.decorator';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Inicio de sesión exitoso',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales incorrectas o usuario desactivado',
  })
  iniciarSesion(
    @Body() datos: LoginDto,
    @Req() request: Request,
  ) {
    return this.authService.iniciarSesion(
      datos.nombreUsuario,
      datos.password,
      request.ip,
    );
  }
}
