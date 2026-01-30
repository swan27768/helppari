import { IsString, IsIn, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(3, 100)
  title: string;

  @IsString()
  @Length(5, 1000)
  body: string;

  @IsIn(['need', 'help', 'notice'])
  type: string;
}
