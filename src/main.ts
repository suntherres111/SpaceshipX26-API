// Force-include the pg driver in Vercel's build trace: TypeORM loads it via a
// computed require(), which @vercel/nft can't see statically, so it gets
// installed during the build but left out of the deployed function bundle
// ("Postgres package has not been found installed") unless it's imported here.
import 'pg';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173' }); // for the React frontend later
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();