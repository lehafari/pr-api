import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/users/models/user.model';
import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { updateUserDto } from '../dto/updateUser.dto';
import { compareSync } from 'bcryptjs';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  //***** Find By User or Email*****//
  async findByUserOrEmail(userOrEmail: string): Promise<User> {
    return await this.findOne({
      where: [{ user: userOrEmail }, { email: userOrEmail }],
    });
  }

  //***** Upload Profile image *****//
  async uploadProfileImage(profileImage: any): Promise<number> {
    const response = await this.createQueryBuilder()
      .update(User)
      .set({ image: profileImage.filename })
      .where('id = :id', { id: profileImage.user })
      .execute();

    if (!response.affected) {
      throw new ForbiddenException('El usuario no existe');
    }
    if (response) {
      return HttpStatus.OK;
    } else {
      throw new ForbiddenException('No se pudo actualizar la imagen');
    }
  }

  //***** Update User*****//
  async updateUser(id: string, user: updateUserDto) {
    const updateUser = await this.createQueryBuilder()
      .update(User)
      .set(user)
      .where('id = :id', { id })
      .execute();
    if (!updateUser) {
      throw new ForbiddenException('El usuario no existe');
    }
    return HttpStatus.OK;
  }

  //***** Delete User *****//
  async deleteUser(id: string, confirmPassword: string) {
    const user = await this.findOne({ id });
    if (!user) {
      return false;
    }

    const verify = this.verifyPassword(confirmPassword, user.password);
    if (!verify) {
      throw new ForbiddenException('La contraseña no es correcta');
    }
    const deleteUser = await this.createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();
    if (!deleteUser) {
      throw new ForbiddenException('El usuario no existe');
    }
    return HttpStatus.OK;
  }

  //***** Verify Password *****//
  verifyPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }
}
