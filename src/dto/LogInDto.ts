import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export default class LogInDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsString({ message: 'Email should be a string' })
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password should be a string' })
    password: string;
}