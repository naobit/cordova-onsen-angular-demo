Cordova + Angular + Onsen Demo App
====

Cordova, Angular, Onsenを使ったサンプル  

# デモ機能
- Push Nortification(AWS SNS)
- Badge
- Touch ID
- Onsen UI
- Dialog

# 利用プラグイン
- cordova-plugin-console
- cordova-plugin-dialogs
- cordova-plugin-touchid
- cordova-plugin-whitelist    
- phonegap-plugin-push

# ビルド方法

#### ビルドしてplatforms/ios/内にxcodeプロジェクトが生成
``cordova build``  
生成されたxcodeプロジェクトを開くとそこからiOS端末で実行可能
  
#### 接続したiosデバイスで実行  
``cordova run ios --devide``

#### Monacaでライブシンク
``monaca livesync``

# iOS Cert.とAWS SNSの設定
1. iOS Member Centerへログイン
1. Identifier > App IDsの登録
	1. Explicit App IDはアプリ自体のBuild Identiferと同一にすること
	1. App ServicesのPush Nortificationsにチェック
1. Certificatesの作成
	1. Apple Push Notification service SSL (Sandbox)を選択
	1. 先ほど作成したApp IDを選択
	1. CSR fileを選択  
		1. [CSRの作り方]
		1. キーチェーンアクセスを開く
		1. 証明書アシスタント > 認証局に証明書アシスタントを要求
		1. メールアドレス > Apple Centerのもの
		1. 通称 > 日本語は使わないで氏名を入力
		1. ディスクに保存
	1. Push通知用のCertificateをDL
1. DLしたCertをクリックにキーチェーンに登録
1. 登録されたキーチェーンをキーチェーンアクセス上で右クリックしp12として書き出し
1. Provisioning Profile作成
	1. App IDで先ほど作成のものを指定
1. xCode側の確認
	- Build IdentifierはApple CenterのApp IDを同じか？
	- Provisioning Profileは先ほど作成のものと同じか？
1. 端末からDevice Tokenを取得
1. AWS設定
	1. AWS > SNS > Applicatons > Create Platform Applications
	1. Push Notification Platform > Apple Developmentを選択
	1. p12ファイルアップロード
1. EndPoint作成(tokenを登録)
1. Publish to Endpoit
1. 届く！！！！
