import {
  Controller,
  Get,
  Post,
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

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //! Disponible para todos los roles !//

  //***** Get actual user *****//
  @UseGuards(
    AuthGuard('jwt'),
    RoleGuard(Roles.USER && Roles.ADMIN && Roles.AGENT),
  )
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
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadedFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }
}
