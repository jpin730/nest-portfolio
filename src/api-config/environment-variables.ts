import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

export class EnvironmentVariables {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT!: number
}
