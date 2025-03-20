import {Controller, Get, HttpStatus, Res} from '@nestjs/common';
import { Response } from "express";

@Controller('health')
export class HealthController {
    @Get()
    checkHealth(@Res() res: Response) {
        res.status(HttpStatus.OK).send({ message: 'Healthy', statusCode: HttpStatus.OK });
    }
}