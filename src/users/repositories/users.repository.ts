import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/users/models/user.model';
import { ForbiddenException, HttpStatus } from '@nestjs/common';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  //***** Find By User or Email*****//
  async findByUserOrEmail(userOrEmail: string): Promise<User> {
    return await this.findOne({
      where: [{ user: userOrEmail }, { email: userOrEmail }],
    });
  }

  //***** Upload Profile image *****//
  async saveProfileImage(profileImage: any): Promise<number> {
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
}
