import { SetMetadata } from '@nestjs/common';
import { Role } from '../modules/user/enum/role';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

