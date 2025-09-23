import { ApiProperty } from "@nestjs/swagger";

export class TokensDto {
  accessToken: string;
  refreshToken: string;
}