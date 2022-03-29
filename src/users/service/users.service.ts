import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from '../models/user.model';
import { UsersRepository } from '../repositories/users.repository';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';
import { updateUserDto } from '../dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  //***** Create User *****//
  //TODO: Validar que el email sea unico
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

  //***** Get Profile Image *****//
  getProfileImage(image: string, res): any {
    if (!fs.existsSync(`./files/${image}`)) {
      throw new NotFoundException('No existe la imagen');
    }
    const img = res.sendFile(image, { root: './files' });
    console.log(img);
    return img;
  }

  // TODO: >>>> //
  //***** Update user*****//

  async updateUser(id: string, user: updateUserDto) {
    const updateUser = await this.usersRepository.updateUser(id, user);
    if (!updateUser) {
      throw new ForbiddenException('El usuario no existe');
    }
    return updateUser;
  }

  //***** Upload profile image *****//
  async uploadProfileImage(profileImage: any): Promise<number> {
    if (!profileImage) {
      throw new BadRequestException('Tiene que subir una imagen');
    }
    const response = await this.usersRepository.uploadProfileImage(
      profileImage,
    );
    return response;
  }

  //***** Find By User or Email*****//
  async findByUserOrEmail(userOrEmail: string): Promise<User> {
    const user = await this.usersRepository.findByUserOrEmail(userOrEmail);
    if (!user) {
      throw new ForbiddenException('El usuario no existe');
    }

    return user;
  }

  //***** Delete User *****//
  async deleteUser(id: string, confirmPassword: string) {
    const deleteUser = await this.usersRepository.deleteUser(
      id,
      confirmPassword,
    );
    if (!deleteUser) {
      throw new ForbiddenException('El usuario no existe');
    }
    return deleteUser;
  }

  //***** Get all users *****//
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }
}
