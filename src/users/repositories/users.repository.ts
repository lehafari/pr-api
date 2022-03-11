import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/users/models/user.model';
@EntityRepository(User)
export class UsersRepository extends Repository<User> {}
