import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Injectable()
export class ResourceService {
  notifyResourceUpdate(data: string): void {
    pubSub.publish('resourceUpdated', data);
  }
}
