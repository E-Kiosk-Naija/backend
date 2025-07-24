import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class PagedApiResponse<T> {
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
    example: 'Data retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Data returned by the API',
    type: [Object],
  })
  data: T[];

  @ApiProperty({
    description: 'Total number of items available',
    example: 100,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Total number of pages available',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  itemsPerPage: number;

  @ApiProperty({
    description: 'Indicates if this is the last page',
    example: false,
  })
  isLastPage: boolean;

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
    data: T[],
    totalItems: number,
    totalPages: number,
    currentPage: number,
    itemsPerPage: number,
    isLastPage: boolean,
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
    this.data = data;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.isLastPage = isLastPage;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(
    status: string = 'Success',
    message: string,
    data: T[],
    totalItems: number,
    totalPages: number,
    currentPage: number,
    itemsPerPage: number,
    isLastPage: boolean,
  ): PagedApiResponse<T> {
    return new PagedApiResponse<T>(
      true,
      HttpStatus.OK,
      status,
      message,
      data,
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage,
      isLastPage,
    );
  }
}
