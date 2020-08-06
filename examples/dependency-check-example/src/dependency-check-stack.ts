import { Repository } from '@aws-cdk/aws-codecommit';
import { Schedule } from '@aws-cdk/aws-events';
import { SnsTopic } from '@aws-cdk/aws-events-targets';
import { Bucket } from '@aws-cdk/aws-s3';
import { Topic } from '@aws-cdk/aws-sns';
import { EmailSubscription } from '@aws-cdk/aws-sns-subscriptions';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { CodeCommitDependencyCheck } from '@cloudcomponents/cdk-dependency-check';

export class DependencyCheckStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const repository = Repository.fromRepositoryName(this, 'Repository', process.env.REPOSITORY_NAME as string);

    const reportsBucket = new Bucket(this, 'Bucket');

    // The following example runs a task every day at 4am
    const check = new CodeCommitDependencyCheck(this, 'CodeCommitDependencyCheck', {
      repository,
      reportsBucket,
      preCheckCommand: 'npm i',
      schedule: Schedule.cron({
        minute: '0',
        hour: '4',
      }),
    });

    const checkTopic = new Topic(this, 'CheckTopic');

    checkTopic.addSubscription(new EmailSubscription(process.env.DEVSECOPS_TEAM_EMAIL as string));

    check.onCheckStarted('started', {
      target: new SnsTopic(checkTopic),
    });

    check.onCheckSucceeded('succeeded', {
      target: new SnsTopic(checkTopic),
    });

    check.onCheckFailed('failed', {
      target: new SnsTopic(checkTopic),
    });
  }
}
