import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { RestApi } from '@aws-cdk/aws-apigateway';
import { ContentfulWebhook } from '@cloudcomponents/cdk-contentful-webhook';

export class ContentfulWebhookStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, 'Endpoint');
    api.root.addMethod('POST');

    const accessToken = process.env.ACCESS_TOKEN as string;

    const spaceId = process.env.SPACE_ID as string;

    const topics = ['Entry.create'];

    new ContentfulWebhook(this, 'ContentfulWebhook', {
      accessToken,
      spaceId,
      name: 'ExampleWebhook',
      url: api.url,
      topics,
      logLevel: 'debug',
    });
  }
}
