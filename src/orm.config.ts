import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

async function ormConfig(): Promise<TypeOrmModuleOptions> {
  const configService = new ConfigService();
  const commonConf = {
    SYNCHRONIZE: true, // 엔티티에 있는대로 테이블을 생성을 할건지 정한다.
    ENTITIES: [__dirname + '/apis/domain/*{.ts,.js}'],
    MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
    MIGRATIONS_RUN: false,
  };

  return {
    type: 'mysql',
    database: configService.get<string>('DB_DATABSE_NAME'),
    host: configService.get<string>('DB_HOST'),
    port: Number(3306),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    logging: true,
    namingStrategy: new SnakeNamingStrategy(), // createAt, updateAt 스네이크 케이스로 전환
    synchronize: commonConf.SYNCHRONIZE,
    entities: commonConf.ENTITIES,
    migrations: commonConf.MIGRATIONS,
    migrationsRun: commonConf.MIGRATIONS_RUN,
  };
}

export { ormConfig };
