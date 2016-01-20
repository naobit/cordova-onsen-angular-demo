
require 'aws-sdk-v1'

AWS.config({
  :access_key_id => 'AKIAI72M5KN3SFSMEMSQ',
  :secret_access_key => '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',
  :region => 'ap-northeast-1',
})
 
sns = AWS::SNS.new
client = sns.client

response = client.create_platform_endpoint(
  platform_application_arn: 'arn:aws:sns:ap-northeast-1:321747268493:app/APNS_SANDBOX/kyash-proto',
  token: 'cc72ad4afaf750395c9a5bdb121e1ea2432d5ce56056bef5158ce8a27124e6d1'
)
 
endpoint_arn = response[:endpoint_arn]
client.publish(
  target_arn: endpoint_arn,
  message: 'Test push from amazon sns create endpoint'
)
