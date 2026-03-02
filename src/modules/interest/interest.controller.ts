import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth} from '@nestjs/swagger';
import { InterestService } from './interest.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {RolesGuard} from "../../auth/roles.guard";
import {Roles} from "../../auth/roles.decorator";
import {Role} from "../user/enum/role";

@ApiTags('Interests')
@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({summary: 'Create a new interest', description: 'Create a new interest/category (Admin only)'})
  @ApiResponse({status: 201, description: 'Interest created successfully'})
  @ApiResponse({status: 400, description: 'Bad request - Interest already exists'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  @ApiResponse({status: 403, description: 'Forbidden - Admin role required'})
  async create(@Body() createInterestDto: CreateInterestDto) {
    return this.interestService.create(createInterestDto);
  }

  @Get()
  @ApiOperation({summary: 'List all interests', description: 'Get list of all available interests (Public)'})
  @ApiResponse({status: 200, description: 'Interests list retrieved successfully'})
  async findAll() {
    return this.interestService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: 'Get interest by ID', description: 'Retrieve interest details by ID'})
  @ApiResponse({status: 200, description: 'Interest retrieved successfully'})
  @ApiResponse({status: 404, description: 'Interest not found'})
  async findOne(@Param('id') id: string) {
    return this.interestService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({summary: 'Update interest', description: 'Update interest details (Admin only)'})
  @ApiResponse({status: 200, description: 'Interest updated successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  @ApiResponse({status: 403, description: 'Forbidden - Admin role required'})
  @ApiResponse({status: 404, description: 'Interest not found'})
  async update(@Param('id') id: string, @Body() updateInterestDto: UpdateInterestDto) {
    return this.interestService.update(+id, updateInterestDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({summary: 'Delete interest', description: 'Delete an interest (Admin only)'})
  @ApiResponse({status: 200, description: 'Interest deleted successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  @ApiResponse({status: 403, description: 'Forbidden - Admin role required'})
  @ApiResponse({status: 404, description: 'Interest not found'})
  async remove(@Param('id') id: string) {
    return this.interestService.remove(+id);
  }
}
