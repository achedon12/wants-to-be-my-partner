import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {ProjectService} from './project.service';
import {CreateProjectDto} from './dto/create-project.dto';
import {UpdateProjectDto} from './dto/update-project.dto';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {RolesGuard} from '../../auth/roles.guard';
import {Roles} from '../../auth/roles.decorator';
import {Role} from '../user/enum/role';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Entrepreneur)
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req: any) {
    return this.projectService.create(createProjectDto, req.user.sub);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: any) {
    return this.projectService.findAllByUser(req.user.sub, req.user.role);
  }

  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  async getRecommended(@Request() req: any) {
    return this.projectService.getRecommendedProjects(req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Entrepreneur, Role.Admin)
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req: any) {
    return this.projectService.update(+id, updateProjectDto, req.user.sub, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Entrepreneur, Role.Admin)
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.projectService.remove(+id, req.user.sub, req.user.role);
  }
}
