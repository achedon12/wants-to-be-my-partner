import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth} from '@nestjs/swagger';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../user/enum/role';

@ApiTags('Investments')
@Controller('investment')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Investisseur)
  @ApiOperation({summary: 'Invest in a project', description: 'Create a new investment in a project (Investor only)'})
  @ApiResponse({status: 201, description: 'Investment created successfully'})
  @ApiResponse({status: 400, description: 'Bad request - Cannot invest in own project'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  @ApiResponse({status: 403, description: 'Forbidden - Investor role required'})
  @ApiResponse({status: 404, description: 'Project not found'})
  async create(@Body() createInvestmentDto: CreateInvestmentDto, @Request() req: any) {
    return this.investmentService.create(createInvestmentDto, req.user.sub);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Investisseur, Role.Admin)
  @ApiOperation({summary: 'Get investments', description: 'Get list of investments (own for Investor, all for Admin)'})
  @ApiResponse({status: 200, description: 'Investments list retrieved successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  @ApiResponse({status: 403, description: 'Forbidden - Investor or Admin role required'})
  async findInvestments(@Request() req: any) {
    return this.investmentService.findInvestments(req.user.sub, req.user.role);
  }

  @Get('project/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Get project investments', description: 'Get list of all investments for a specific project'})
  @ApiResponse({status: 200, description: 'Project investments retrieved successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  @ApiResponse({status: 404, description: 'Project not found'})
  async findProjectInvestments(@Param('id') id: string) {
    return this.investmentService.findProjectInvestments(+id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Investisseur)
  @ApiOperation({summary: 'Cancel investment', description: 'Cancel an investment (investor only)'})
  @ApiResponse({status: 200, description: 'Investment deleted successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - No valid JWT token'})
  @ApiResponse({status: 403, description: 'Forbidden - Cannot delete other investors investments'})
  @ApiResponse({status: 404, description: 'Investment not found'})
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.investmentService.remove(+id, req.user.sub);
  }
}
