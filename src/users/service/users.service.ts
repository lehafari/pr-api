import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from '../models/user.model';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  //***** Create User *****//
  async createUser(crateUserDto: CreateUserDto): Promise<User> {
    try {
      const userEntity = await this.usersRepository.create({ ...crateUserDto });
      const user = await this.usersRepository.save(userEntity);
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ForbiddenException('El usuario o el email ya existen');
      }
      throw error();
    }
  }

  //***** Save profile image *****//

  async saveProfileImage(profileImage: any) {
    const user = await this.usersRepository.saveProfileImage(profileImage);
    return user;
  }

  //***** Find By User or Email*****//
  async findByUserOrEmail(userOrEmail: string): Promise<User> {
    const user = await this.usersRepository.findByUserOrEmail(userOrEmail);
    if (!user) {
      throw new ForbiddenException('El usuario no existe');
    }
    return user;
  }
}
