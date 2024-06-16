import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger('Bootstrap', { timestamp: true })
  const app = await NestFactory.create(AppModule)
  const config = app.get<ConfigService>(ConfigService)
  const port = config.getOrThrow<number>('PORT')

  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix('api/v1')

  await app.listen(port, () => logger.log(`Server running on port ${port}`))
}
bootstrap()
