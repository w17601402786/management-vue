
<template>
    <div>
        <div class="chat-window" v-loading="loading">
            <div class="chat-dialogue">
                <div v-for="message in messages" :key="message.id">
                    <div v-if="message.type === 'received'" class="received-message">
                        {{ message.text }}
                    </div>
                    <div v-else class="sent-message">
                        {{ message.text }}
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <el-input
                    @keyup.enter="sendMessage"
                    :autosize="{ minRows: 2, maxRows: 5}"
                    placeholder="请输入内容"
                    v-model="newMessage">
                </el-input>
                <el-button :disabled="isDisable" @click="sendMessage" type="success" icon="el-icon-check" circle></el-button>
               
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { send } from 'q';

// import { Configuration, OpenAIApi } from "openai";
// const configuration = new Configuration({
//     organization: "YOUR_ORG_ID",
//     apiKey: sk-sX5SuWY74QzIusIjfKaefj416JVXYRwCX9LGfSCsVx069AUv,
// });
// const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

export default {
    name: 'AiAnalysis',
    props: {
        scoreList: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            loading: false,
            scoreData:this.scoreList,
            messages: [
                { id: 1, type: "received", text: "我可以帮助你分析成绩喔" },
            ],
            //gpt-3.5-turbo对话上下文
            messages2: [{
                role: 'user',
                content: '现在需要你扮演一个老师，你的名字叫王宇哲，你需要帮助用户来分析学生的成绩'
            }],
            newMessage: "",
            model: 'gpt-3.5-turbo',
            token:'sk-sX5SuWY74QzIusIjfKaefj416JVXYRwCX9LGfSCsVx069AUv',
            temperature: 1,
            presence_penalty: 0,
            messageLength: 2,
            isDisable: false,
        };
    },
    methods: {
        sendMessage() {

            this.loading = true;
            this.isDisable = true;

            if (this.newMessage !== "") {
                this.messages.push({
                    id: this.messages.length + 1,
                    type: "sent",
                    text: this.newMessage,
                });
                
                this.getReply(this.newMessage);
                

            }
        },
        processData(){



            let sendData = [];
            for(let i = 0; i < this.scoreList.length; i++){
                let data = {
                    name: this.scoreList[i].studentInfo.name,
                    score: this.scoreList[i].score,
                }
                sendData.push(data);
            }

            let sendMessage = "下面是本次对话的成绩数据：\n";
            for(let i = 0; i < sendData.length; i++){
                sendMessage += sendData[i].name + "的成绩是：" + sendData[i].score + "\n";
            }
            return sendMessage;
        },
        async getReply(message){
            let api = "https://api.chatanywhere.cn/v1/chat/completions";
            let sendMessage = this.processData();
            message = message + "\n" + sendMessage;
            this.messages2.push({
                role: 'user',
                content: message
            });
            const data = {
                prompt: message,
                model: this.model,
                temperature: this.temperature,
                maxTokens: 200,
                messages: this.messages2,
                stream: true
            };


            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Accept-Language", "zh-CN,zh-Hans;q=0.9");
            myHeaders.append("Authorization", `Bearer ${this.token}`);

            var myInit = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(data),
                mode: 'cors',
                cache: 'default'
            };


            const response = await fetch(api, myInit);

            const reader = response.body.getReader();

            this.loading = false;

            while (true) {

                const { done, value } = await reader.read();
                if (done) {


                    console.log("complete");

                    let resultMessage = this.messages[this.messageLength].text;
                    console.log(resultMessage);

                    this.messages2.push({
                        role: 'assistant',
                        content: resultMessage
                    });
                    break;
                }
                const utf8Decoder = new TextDecoder('utf-8');
                let data = value ? utf8Decoder.decode(value, {stream: true}) : '';
                //data: {"id":"chatcmpl-7M9N37x3wM1vRsfYImBH8n6Pe8Slw","object":"chat.completion.chunk","created":1685513593,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"role":"assistant"},"index":0,"finish_reason":null}]}
                //data: {"id":"chatcmpl-7M9N37x3wM1vRsfYImBH8n6Pe8Slw","object":"chat.completion.chunk","created":1685513593,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"学"},"index":0,"finish_reason":null}]}
                //data可能是多个json，需要分割，以换行符分割，然后再解析，记得去掉“data: ”
                let dataArr = data.split("\n");

                //解析json
                for(let i = 0; i < dataArr.length; i++){
                    //去掉“data: ”
                    let dataStr = dataArr[i].substring(6);
                    //尝试解析json，如果不是json，就不解析
                    try{
                        let dataJson = JSON.parse(dataStr);
                        this.addMessage(dataJson.choices[0].delta.content,this.messageLength);
                    }catch(e){
                    }
                }
                

            }

            this.isDisable = false;
            this.newMessage = "";
            this.messageLength+=2;

        },
        addMessage(reply, index){


            if(reply == "" || reply == undefined){
                return;
            }


            //如果index不存在，就创建一个对象，如果存在，就在原来的对象上添加
            if(this.messages[index] == undefined){
                this.messages.push({
                    id: index + 1,
                    type: "received",
                    text: reply,
                });
            }else{
                this.messages[index].text += reply;
            }

            // this.messages.push({
            //     id: this.messages.length + 1,
            //     type: "received",
            //     text: reply.content,
            // });
            // console.log(this.messages2);
            // this.messages2.push(reply);

            // console.log(this.messages2);

        }
    },
};
</script>

<style>
.chat-window {
    display: flex;
    flex-direction: column;
    height: 500px;
    width: 400px;
    border: 1px solid black;
    border-radius: 5px;
    margin: 20px auto;
}

.chat-dialogue {
    flex: 1;
    padding: 10px;
    overflow-y: scroll;
}

.received-message {
    background-color: #f1f0f0;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
}

.sent-message {
    background-color: #007bff;
    color: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    align-self: flex-end;
}

.chat-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
}

.chat-input input {
    flex: 1;
    margin-right: 10px;
    padding: 10px;
    border-radius: 5px;
    border: none;
}

.chat-input button {
    padding: 10px;
    border-radius: 5px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}
</style>
