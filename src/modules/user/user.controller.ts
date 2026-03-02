import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth} from '@nestjs/swagger';
import { UserService } from './user.service';
import { InterestService } from '../interest/interest.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AssociateInterestsDto } from '../interest/dto/associate-interests.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from './enum/role';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly interestService: InterestService,
  ) {}

  @Post()
  @ApiOperation({summary: 'Create a new user', description: 'Register a new user account'})
  @ApiResponse({status: 201, description: 'User created successfully'})
  @ApiResponse({status: 400, description: 'Bad request - Email already exists'})
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Get user profile', description: 'Retrieve the authenticated user profile'})
  @ApiResponse({status: 200, description: 'User profile retrieved successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  async getProfile(@Request() req: any) {
    return this.userService.findOne(req.user.sub);
  }

  @Put('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Update user profile', description: 'Update authenticated user personal information and interests'})
  @ApiResponse({status: 200, description: 'User profile updated successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  async updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.sub, updateProfileDto);
  }

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({summary: 'List all users', description: 'Get list of all users (Admin only)'})
  @ApiResponse({status: 200, description: 'List of users retrieved successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  @ApiResponse({status: 403, description: 'Forbidden - Admin role required'})
  async findAll() {
    return this.userService.findAll();
  }

  @Post('interests')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Associate interests with user', description: 'Link interests/preferences to authenticated user'})
  @ApiResponse({status: 200, description: 'Interests associated successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  async associateInterests(@Request() req: any, @Body() associateInterestsDto: AssociateInterestsDto) {
    return this.interestService.associateInterests(req.user.sub, associateInterestsDto);
  }

  @Get('interests')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Get user interests', description: 'Retrieve interests of authenticated user'})
  @ApiResponse({status: 200, description: 'User interests retrieved successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  async getUserInterests(@Request() req: any) {
    return this.interestService.getUserInterests(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({summary: 'Get user by ID', description: 'Retrieve user information by user ID'})
  @ApiResponse({status: 200, description: 'User retrieved successfully'})
  @ApiResponse({status: 404, description: 'User not found'})
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Update user', description: 'Update user information by ID'})
  @ApiResponse({status: 200, description: 'User updated successfully'})
  @ApiResponse({status: 404, description: 'User not found'})
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({summary: 'Delete user', description: 'Delete user by ID (Admin only)'})
  @ApiResponse({status: 200, description: 'User deleted successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  @ApiResponse({status: 403, description: 'Forbidden - Admin role required'})
  @ApiResponse({status: 404, description: 'User not found'})
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

