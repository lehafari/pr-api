import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { RoleGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../enum/roles.enum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), RoleGuard(Roles.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by email' })
  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} user`;
  }
}
