import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './common/database/database.module'
import { ResourcesModule } from './resources/resources.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ResourcesModule,
  ],
})
export class AppModule {}
