import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { RoleGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../enum/roles.enum';
import { User } from '../models/user.model';
import { GetUser } from '../decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/upload';
import { confirmPasswordDto, updateUserDto } from '../dto';
import { PayloadJwt } from '../types';
import { Body } from '@nestjs/common';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //! Disponible para todos los roles !//

  //***** Get actual user *****//
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get actual user' })
  @Get('me')
  getActualUser(@GetUser() user: PayloadJwt): Promise<User> {
    return this.usersService.findByUserOrEmail(user.email);
  }

  //***** Get Profile Image*****//
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile image' })
  @Get('profileImage/:imgpath')
  seeUploadedFile(@Param('imgpath') image: string, @Res() res): any {
    return this.usersService.getProfileImage(image, res);
  }

  //***** Upload Profile image*****//
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload profile image' })
  @Put('profileImage/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file, @GetUser() user): Promise<number> {
    try {
      file.user = user.userId;
      const profileImage = file;
      return this.usersService.uploadProfileImage(profileImage);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Ha ocurrido un error subiendo la imagen',
      );
    }
  }

  //***** Update user*****//

  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: updateUserDto })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @Put('update')
  async updateUser(
    @GetUser() User: PayloadJwt,
    @Body() UpdateUser: updateUserDto,
  ) {
    try {
      return await this.usersService.updateUser(User.userId, UpdateUser);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Ha ocurrido un error actualizando el usuario',
      );
    }
  }

  //***** Delete user *****//

  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: confirmPasswordDto })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @Delete('delete')
  async deleteUser(
    @GetUser() user: PayloadJwt,
    @Body() confirmPassword: confirmPasswordDto,
  ) {
    try {
      return await this.usersService.deleteUser(
        user.userId,
        confirmPassword.password,
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        error.message || 'Ha ocurrido un error eliminando el usuario',
      );
    }
  }

  //! Disponible solo para el rol ADMIN !//

  //***** Get all users *****//
  @UseGuards(AuthGuard('jwt'), RoleGuard(Roles.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @Get('all')
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
