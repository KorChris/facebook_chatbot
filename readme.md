# 나만의 페이스북 메신저 봇 만들기

이 글은 *Nodejs*, *Heroku server*를 이용하여 자신만의 페이스북 챗봇을 만들어보는 템플릿 예제입니다. 이후에 *Api.ai*를 이용하여 더 똑똑한 챗봇을 만드는 과정을 포스팅하겠습니다.

## 챗봇이란?

**챗봇**은 사용자가 별도로 웹사이트나 앱을 따로 실행하지 않고도 대화하듯 정보를 얻을 수 있는 서비스다. 기존 사용자 자신이 쓰는 메신저를 통해 정보를 얻을 수 있다는 점이 현재 구글, 페이스북, 마이크로소프트, 텔레그램을 비롯해 국내 네이버, 다음 등 IT 분야 기업들이 챗봇을 기반으로 한 메신저 플랫폼을 선보이는 중이다.

>[네이버 지식백과] 채팅봇, 챗봇 - 메신저 서비스 인공지능(AI)과 만나다 (용어로 보는 IT)

## 준비시작
 
1. Javascript에 대한 기본 지식(문법)
    * [생활코딩 자바스크립트 기본강의](https://opentutorials.org/module/532) 추천합니다.
2. Nodejs 
    * [Nodejs](https://nodejs.org/ko)에서 다운로드합니다. LTS 버전을 추천합니다.
3. Git
    * Git 설치는 [생활코딩 지옥에서 온 Git 중 설치방법](https://opentutorials.org/course/2708/15129) 강의를 보시면 수월하게 진행하실 수 있습니다.
3. Heroku
    * [heroku](https://heroku.com) 에 가입합니다.
4. Facebook Account
    * Facebook account가 필요합니다.

### Nodejs로 프로젝트 시작하기

Nodejs설치한 후에 다음과 같은 명령어로 프로젝트를 시작합니다. 
설치는 [생활코딩 Nodejs 설치](https://opentutorials.org/course/2136/11852) 강의를 보시면 수월하게 진행하실 수 있습니다.

설치를 완료하신 후, 원하는 폴더/디렉토리에서 다음과 같은 명령어로 기본 프로젝트를 생성합니다.

저같은 경우에는 dev라는 폴더를 새로 생성한 후(`mkdir dev`)에, dev로 들어가서(`cd dev`) 프로젝트파일을 생성하였습니다. 

```bash
mkdir dev
cd dev
sudo npm install npm -g
npm init
npm install express request body-parser --save
```
npm init를 실행하시면 다음과 같이 물어볼텐데 `entry point`만 `app.js`로 설정해주신 후 나머지는 자유롭게 설정해주시면 됩니다.

```bash
package name: (dev)
version: (1.0.0)
description:
entry point: (index.js) app.js
test command: 
git repository:
keywords:
author:
license: (ISC)
```

아래와 같이 나오면 성공입니다. version은 다르셔도 괜찮습니다. 

```bash
+ body-parser@1.17.2
+ express@4.15.3
+ request@2.81.0
added 96 packages in 5.53s
```

### 페이스북 앱 세팅하기

1. Facebook Page
    - Chat bot을 적용시킬 `Facebook Page`를 만드신 후에 [Facebook Developer Page](developer.facebook.com)에 접속합니다. 

![facebook page 만들기](/images/facebook_page.png)
![페이스북 개발자 페이지](/images/develop_facebook.png)

2. Facebook App
  - Add a new App을 누르시고 새로운 App을 만듭니다.

![add_app](/images/add_app.png)

![new_app](/images/new_app.png)

![create_app](/images/create_app.png)
  - Messenger에서 set up버튼을 누릅니다.

![여러가지 플랫폼중에 챗봇을 위한 messenger를 선택](/images/select_form.png)

### app.js 파일 작성

이제 Heroku 서버에 배포시킬 자바스크립트 파일을 작성합니다.
`app.js`라는 이름으로 처음 nodejs를 통해 npm install을 진행했던 폴더(이 글의 경우, dev폴더)에 저장합니다.

```javascript
'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Hello world');
})

app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === 'VERIFY_TOKEN') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
})

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
})

```

app.js를 완성하셨다면 폴더 안에 있는 `package.json`을 수정하셔야 합니다. 파일 내의 main과 scripts 안에 있는 내용을 다음과 같이 수정해줍니다.

```json
...
"main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
 ...
```

이제 배포 단계입니다. git저장소를 만드시고 heroku server를 만드신 후에, git push를 통해 heroku에 배포해줍니다. 

```
git init
git add .
git commit -m 'init'
heroku create
git push heroku master
```

저는 다음과 같은 결과가 나왔습니다.

```bash
KorChris$ heroku create
Creating app... done, ⬢ YOUR_DYNO_NAME
https://YOUR_DYNO_NAME.herokuapp.com/ | https://git.heroku.com/YOUR_DYNO_NAME.git

KorChris$ git push heroku master
Counting objects: 4, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 1018 bytes | 0 bytes/s, done.
...
...
...

remote: Verifying deploy... done.
To https://git.heroku.com/YOUR_DYNO_NAME.git
   199.........73c  master -> master

```

### 페이스북 App 세팅하기

이제 Heroku server와 페이스북 App을 연결시켜줍니다.
페이스북 앱 관리창에 가셔서 전 단계와 같이 Messenger 탭을 클릭합니다.

Token Generation
  - Token Generation에서 자신이 만든 page를 고르시고

![token_generation](/images/token_generation.png)

![token_ex](/images/token_ex.png)
  - 생성된 Token을 Click해서 본인만 알 수 있도록 기록해둡니다. 나중에 이 token을 이용해서 프로그래밍을 하게 됩니다.

그 후에는 Webhook을 설정해야합니다.

Webhook Setting
  - token generation 하단에 다음과 같이 Webhook을 설정할 수 있는 탭을 발견할 수 있습니다.

![Webhook Set up](/images/webhook.png)

아래와 같이 heroku에서 생성된 Dyno의 URL을 입력하고 뒤에 /webhook을 넣어주시고
VERIFY TOKEN에는 'VERIFY_TOKEN'을 넣어줍니다. 
![set_webhook](/images/set_webhook.png)

Webhook set up이 끝났다면 token generation때 사용했던 page를 다시 선택해주시고, subscribe버튼을 클릭해줍니다. 
![subscribe](/images/subscribe.png)


### 간단한 Echo bot 만들기


app.js를 수정하여 사용자가 보낸 text를 그대로 다시 보내는 Echo Bot을 만들어보겠습니다.
Token generation단계에서 받은 token을 PAGE_ACCESS_TOKEN에 넣어주고, app.js를 다음과 같이 작성합니다. 자세한 코드 설명은 다음 글에서 다루겠습니다.
```javascript
'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

//작은 따옴표 사이에 본인이 받으신 token을 paste합니다.
//나중에 보안을 위해서 따로 setting을 하는 방법을 알려드리겠습니다.
//이 토큰이 포함된 파일을 절대 업로드하거나 github에 적용시키지 마세요.
var PAGE_ACCESS_TOKEN = 'YOUR TOKEN HERE';

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Hello world');
})


app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === 'VERIFY_TOKEN') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
})

app.post("/webhook", function(req, res) {
    console.log("WEBHOOK GET IT WORKS");
    var data = req.body;
    console.log(data);

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function(messagingEvent) {
                if (messagingEvent.optin) {
                    receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else if (messagingEvent.postback) {
                    receivedPostback(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        res.sendStatus(200);
    }
});

function receivedMessage(event) {
    var senderId = event.sender.id;
    var content = event.message.text;
    var echo_message = "ECHO : " + content;
    sendTextMessage(senderId, echo_message);
}

function receivedPostback(event) {
    console.log("RECEIVED POSTBACK IT WORKS");
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    sendTextMessage(senderID, "Postback called");
}

function sendTextMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: { text: message }
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ' + response.error);
        }
    });
}

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
})
```

app.js를 모두 작성하셨으면 Git을 이용하여 수정된 파일을 다시 배포해줍니다.
```bash
git add .
git commit -m 'echo bot'
git push heroku master
```

이제 Echo bot이 완성되었습니다. 

페이스북을 통해서 메세지를 보내봅시다.

![echo bot](/images/echobot.png)

### 마치며
다음 글에서는 코드 분석 및 더 많은 페이스북 메신저 기능을 적용하는 법을 다루도록 하겠습니다.

제가 다룬 코드는 제 [Github](https://github.com/KorChris/facebook_chatbot)에서 확인하실 수 있습니다.

감사합니다.

> Ref : 
>1. https://www.sitepoint.com/building-facebook-chat-bot-node-heroku
>2. https://github.com/fbsamples/messenger-platform-samples
>3. https://github.com/jw84/messenger-bot-tutorial