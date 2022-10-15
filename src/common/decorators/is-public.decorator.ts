import { applyDecorators, SetMetadata } from '@nestjs/common';

export const IsPublic = () =>
  applyDecorators(
    SetMetadata('isPublic', true),
    SetMetadata('swagger/apiSecurity', ['public']),
  );
