import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiResponse,
} from '@nestjs/swagger';
import { RequestDto } from './dtos/Request.dto';

@ApiTags('User Rate Limit')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('request')
    @ApiOperation({ summary: 'Send a request with rate limiting (max 5/min)' })
    async handleRequest(@Body() body: RequestDto) {
        const { user_id, payload } = body;

        if (!user_id) {
            throw new HttpException('user_id is required', HttpStatus.BAD_REQUEST);
        }

        const result = await this.userService.handleRequest(user_id, payload);

        if (!result.success) {
            throw new HttpException(
                'Rate-Limit-Hit--wait for some time, try after that--',
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }
        return result;
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get per-user request stats' })
    @ApiResponse({
        status: 200,
        description: 'Stats fetched successfully',
        schema: {
            example: {
                'user-123': {
                    requests_last_minute: 3,
                    window_expires_in_seconds: 40,
                },
            },
        },
    })
    async getStats() {
        return await this.userService.getStats();
    }
}