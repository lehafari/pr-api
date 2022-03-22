import {
  Controller,
  Get,
  Param,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
// import { RoleGuard } from '../../auth/guards/roles.guard';
// import { Roles } from '../enum/roles.enum';
import { User } from '../models/user.model';
import { GetUser } from '../decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/upload';

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
  getActualUser(@GetUser() user: User): Promise<User> {
    return this.usersService.findByUserOrEmail(user.email);
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
      return error;
    }
  }

  //***** Get Profile Image*****//
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile image' })
  @Get('profileImage/:imgpath')
  seeUploadedFile(@Param('imgpath') image: string, @Res() res): any {
    return this.usersService.getProfileImage(image, res);
  }
}
