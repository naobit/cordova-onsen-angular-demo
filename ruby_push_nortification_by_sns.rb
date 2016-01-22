
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
  token: 'b832f5b8363ee52e0c602c0a147d39e2c9f35313f799098b2e71d09486219694'
)
 
endpoint_arn = response[:endpoint_arn]
client.publish(
  target_arn: endpoint_arn,
  message: 'JCBでお金が使われましたよ！'
)
