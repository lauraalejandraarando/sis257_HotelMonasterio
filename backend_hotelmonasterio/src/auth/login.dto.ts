
import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @MaxLength(50)
  nombreUsuario: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MaxLength(100)
  password: string;
}
