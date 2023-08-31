import { Module } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';

@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService], // Make the service available for injection in other modules
})
export class LoggerModule {}
