import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  Optional,
} from '@nestjs/common';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: Logger;

  constructor(@Optional() @Inject('LOG_CONTEXT') private context: string) {
    this.logger = new Logger(this.context);
  }

  log(requestId: string, message: string) {
    this.logger.log(`[${requestId}] ${message}`);
  }

  error(requestId: string, message: string, trace?: string) {
    this.logger.error(`[${requestId}] ${message}`, trace);
  }

  warn(requestId: string, message: string) {
    this.logger.warn(`[${requestId}] ${message}`);
  }

  debug(requestId: string, message: string) {
    this.logger.debug(`[${requestId}] ${message}`);
  }

  verbose(requestId: string, message: string) {
    this.logger.verbose(`[${requestId}] ${message}`);
  }
}
