import { Resolver, Query, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver()
export class ResourceResolver {
  @Query(() => String)
  getResource(): string {
    return 'Resource data';
  }

  @Subscription(() => String, {
    resolve: (payload) => payload,
  })
  resourceUpdated() {
    return pubSub.asyncIterableIterator('resourceUpdated');
  }
}
