import { Body, Controller, HttpCode, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/services/auth.service';
import { CreateUserDto } from 'src/users/dto';
import { LoginDto } from '../dto';
import { LoginResponse } from '../interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Crear usuario' })
  @HttpCode(201)
  @Put('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
  @ApiBody({ type: LoginDto })
  @HttpCode(200)
  @ApiOperation({ summary: 'Autenticar Usuario' })
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }
}
