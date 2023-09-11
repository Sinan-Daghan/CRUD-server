import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { Project } from './project.interface';

require('dotenv').config();

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  private async handleOperation(
    operation: () => Promise<void>,
    res: Response,
    successStatus: HttpStatus,
    errorMessage: string
  ): Promise<void> {
    try {
      await operation();
      const db = await this.appService.readDatabase();
      res.status(successStatus).json(db);
    } catch (error) {
      console.error(errorMessage, error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
  }

  @Post('login')
  async login(@Body('password') password: string, @Res() res: Response): Promise<void> {
    if (password === process.env.LOGIN_PASSWORD) {
      console.log('password', process.env.LOGIN_PASSWORD);
      res.status(HttpStatus.OK).json({ message: 'loggedIn' });
    } else {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
  }

  @Post('create')
  async create(@Body() project: Project, @Res() res: Response): Promise<void> {
    await this.handleOperation(
      () => this.appService.createRow(project),
      res,
      HttpStatus.CREATED,
      'Error creating row'
    );
  }

  @Post('update')
  async update(@Body() project: Project, @Res() res: Response): Promise<void> {
    await this.handleOperation(
      () => this.appService.updateRow(project),
      res,
      HttpStatus.OK,
      'Error updating row'
    );
  }

  @Post('delete')
  async delete(@Body() project: Project, @Res() res: Response): Promise<void> {
    await this.handleOperation(
      () => this.appService.deleteRow(project),
      res,
      HttpStatus.OK,
      'Error deleting row'
    );
  }

  @Get('read')
  async read(@Res() res: Response): Promise<void> {
    await this.handleOperation(
      async () => {
        const db = await this.appService.readDatabase();
        res.status(HttpStatus.OK).json(db);
      },
      res,
      HttpStatus.OK,
      'Error reading database'
    );
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}