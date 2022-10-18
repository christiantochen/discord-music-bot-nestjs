import { Param } from '@discord-nestjs/core';

export class PlayDto {
  @Param({
    description: 'Enter keyword or Youtube URL.',
    required: true,
  })
  song: string;
}
