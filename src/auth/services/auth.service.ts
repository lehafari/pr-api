import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/service/users.service';
import { LoginDto } from '../dto';
import config from 'src/config/config';
import { compareSync } from 'bcryptjs';
import { User } from 'src/users/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { LoginResponse } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly jwtService: JwtService,
  ) {}

  //***** Sign Up *****//
  signup(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  //***** Login *****//
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    // Buscamos por el usuario o el email
    const user = await this.usersService.findByUserOrEmail(
      loginDto.userOrEmail,
    );
    if (!user) throw new BadRequestException('Usuario no existe');
    // Verificamos la contraseña
    const verify = this.verifyPassword(loginDto.password, user.password);
    delete user.password;
    if (!verify) throw new BadRequestException('Contraseña incorrecta');
    // Si todo esta bien devolvemos un token firmado
    return {
      token: this.jwtService.sign(
        { userId: user.id, email: user.email, role: user.role },
        {
          secret: this.configService.jwt.secret,
          expiresIn: '6h',
        },
      ),
    };
  }

  //***** Verify Password *****//
  verifyPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }
}
