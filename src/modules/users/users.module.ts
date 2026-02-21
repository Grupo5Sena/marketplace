import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Reflector } from '@nestjs/core';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, RolesGuard, Reflector],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
