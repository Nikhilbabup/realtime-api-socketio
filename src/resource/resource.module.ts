import { Module } from '@nestjs/common';
import { ResourceResolver } from './resource.resolver';
import { ResourceService } from './resource.service';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ResourceModule,
  ],
  providers: [ResourceResolver, ResourceService],
})
export class ResourceModule {}
