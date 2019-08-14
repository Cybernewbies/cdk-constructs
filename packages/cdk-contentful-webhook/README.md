# @cloudcomponents/cdk-contentful-webhook

> Cdk component that provisions contentful webhooks

## Install

```bash
npm install --save @cloudcomponents/cdk-contentful-webhook
```

## How to use

```typescript
import { RestApi } from '@aws-cdk/aws-apigateway';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { ContentfulWebhook } from '@cloudcomponents/cdk-contentful-webhook';

export class ContentfulWebhookStack extends Stack {
    public constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'TargetWebhook');
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
```

## License

[MIT](../../LICENSE)