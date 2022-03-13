import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/users/models/user.model';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  //***** Find By User or Email*****//
  async findByUserOrEmail(userOrEmail: string): Promise<User> {
    return await this.findOne({
      where: [{ user: userOrEmail }, { email: userOrEmail }],
    });
  }
}
