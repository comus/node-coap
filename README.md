# udp-server.js

當作 coap-server, 是 udp server 來的.

接收 gateway 的請求，並 forward 到 http server.

在這裡 http server 並沒有 implement，你可以開一個簡單的 http server, 並取代以下網址

![image](https://user-images.githubusercontent.com/1200981/117581188-31f9d280-b12e-11eb-8f63-7915acad7e53.png)

在這裡我是手動建立一個 coap response buffer 返回給 gateway 和發送 node，如果需要更改那個 buffer 可以更改這行

![image](https://user-images.githubusercontent.com/1200981/117581225-5b1a6300-b12e-11eb-87ae-01051b1b66f3.png)

# analytics.js

把收集的數據進行各種處理，平均之類.

