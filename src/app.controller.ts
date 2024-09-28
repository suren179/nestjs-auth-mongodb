import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Home')
@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly logger: Logger,
	) {}

	@Get()
	@ApiOperation({ summary: 'Api Home Page' })
	getHello(): string {
		return this.appService.getHello();
	}
}
