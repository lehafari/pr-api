import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from '../models/user.model';
import { UsersRepository } from '../repositories/users.repository';
import * as fs from 'fs';

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

  //***** Upload profile image *****//

  async uploadProfileImage(profileImage: any) {
    const response = await this.usersRepository.saveProfileImage(profileImage);
    return response;
  }

  //***** Get Profile Image *****//
  getProfileImage(image: string, res): any {
    if (!fs.existsSync(`./files/${image}`)) {
      throw new NotFoundException('No existe la imagen');
    }
    const img = res.sendFile(image, { root: './files' });
    console.log(img);
    return img;
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
