import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  signup(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
