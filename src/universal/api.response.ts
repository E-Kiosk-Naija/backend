import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({
    description: 'Status of the API response',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP status code of the response',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Status message of the API response',
    example: 'Success',
  })
  status: string;

  @ApiProperty({
    description: 'Detailed message of the API response',
    example: 'User registered successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Optional Data returned by the API',
    type: Object,
    required: false,
  })
  data?: T;

  @ApiProperty({
    description: 'Timestamp of the API response',
    example: new Date().toISOString(),
  })
  timestamp: string;

  constructor(
    success: boolean,
    statusCode: number,
    status: string,
    message: string,
    data?: T,
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(
    statusCode: number,
    message: string,
    data?: T,
  ): ApiResponse<T> {
    return new ApiResponse<T>(true, statusCode, 'Success', message, data);
  }
}
