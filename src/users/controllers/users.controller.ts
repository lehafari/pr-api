import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { RoleGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../enum/roles.enum';
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
    console.log(user);
    return this.usersService.findByUserOrEmail(user.email);
  }

  //***** Upload Profile image*****//
  @UseGuards(AuthGuard('jwt'), RoleGuard(Roles.USER && Roles.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload profile image' })
  @Put('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file, @GetUser() user) {
    try {
      file.user = user.userId;
      const profileImage = file;
      return this.usersService.saveProfileImage(profileImage);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }
}
