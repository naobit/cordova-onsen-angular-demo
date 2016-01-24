
require 'aws-sdk-v1'

AWS.config({
  :access_key_id => 'AKIAIUP3VS5QOE5E4DUA',
  :secret_access_key => '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',
  :region => 'ap-northeast-1',
})
 
sns = AWS::SNS.new
client = sns.client

response = client.create_platform_endpoint(
  platform_application_arn: 'arn:aws:sns:ap-northeast-1:870907019426:app/APNS_SANDBOX/Cdv-Ons-Ng-Demo',
  token: 'b832f5b8363ee52e0c602c0a147d39e2c9f35313f799098b2e71d09486219694'
)
 
endpoint_arn = response[:endpoint_arn]
client.publish(
  target_arn: endpoint_arn,
  message: 'JCBでお金が使われましたよ！'
)

#TODO こちらも参考にすること！ http://qiita.com/g08m11/items/017805aceca3f5203009
# http://qiita.com/jun3/items/2cbff7664e49fb93bf39
