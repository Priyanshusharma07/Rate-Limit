import { ApiProperty } from '@nestjs/swagger';

export class RequestDto {
    @ApiProperty({
        example: 'user-123',
        description: 'Unique user identifier',
    })
    user_id: string;

    @ApiProperty({
        example: { message: 'hello' },
        description: 'Any payload data',
    })
    payload: any;
}