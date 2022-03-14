import { User } from 'src/users/models/user.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @Column()
  title: string;

  @Column()
  route: string;

  @Column()
  content: string;

  @Column()
  price: number;

  @Column()
  date: Date;

  @Column()
  address: string;

  @Column()
  areacapital_location: string;

  @Column()
  municipality_location: string;

  @Column()
  zipcode: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  status: boolean;

  @Column()
  statusPackage: string;
}

// Property
// TODO: Revisar date, Status, y el resto que esta en !rojo
// TODO: Agregar Imagenes
//* id =PK
//* userID = FK
//! packageID = FK
//* title
//* route
//* content
//* price
//! typeID = FK
//! subtypeID = FK
//? date
//! tag = FK???
//! formbuilderJSON
//! detailsJSON
//! featuresJSON
//! videoURL
//! audioVideoURL
//! tour360URL
//* address
//* areacapital_location
//* municipal_location
//* zipcode
//* lat
//* log
//! streetview
//! documentPDF
//* status
//* statusPackage
//! listing_type
//! finish_at
