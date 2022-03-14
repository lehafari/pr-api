import { genSaltSync, hashSync } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { Property } from 'src/properties/models/property.model';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Roles } from '../enum/roles.enum';

@Entity()
@Unique(['email', 'user'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  nit: string;

  @Column({ nullable: true })
  fiscalname: string;

  @Column({ nullable: true })
  fiscaladdress: string;

  @Column({ default: true })
  status: boolean;

  @Column({ default: false })
  image: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ enum: Roles, default: Roles.USER })
  role: Roles;

  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword() {
    if (this.password) this.password = hashSync(this.password, genSaltSync());
  }
}
