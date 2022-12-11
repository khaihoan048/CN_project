//
//
//
// import "bootstrap/dist/css/bootstrap.min.css";
// import '../App.css';
// import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
// import {
//   BasicStorage,
//   ChatMessage,
//   ChatProvider,
//   Conversation,
//   ConversationId,
//   ConversationRole,
//   IStorage,
//   MessageContentType,
//   Participant,
//   Presence,
//   TypingUsersList,
//   UpdateState,
//   User,
//   UserStatus
// } from "@chatscope/use-chat";
// import {P2PChatService} from "../chatService/IChatService.ts";
// import Chat from "./Chat";
// import {nanoid} from "nanoid";
// import {Col, Container, Row} from "react-bootstrap";
// import {akaneModel, eliotModel, emilyModel, joeModel, users} from "../data/data";
// import {AutoDraft} from "@chatscope/use-chat/dist/enums/AutoDraft";
// import MyPeer from "../handlers/PeerController";
//
// // sendMessage and addMessage methods can automagically generate id for messages and groups
// // This allows you to omit doing this manually, but you need to provide a message generator
// // The message id generator is a function that receives message and returns id for this message
// // The group id generator is a function that returns string
// const messageIdGenerator = (message: ChatMessage<MessageContentType>) => nanoid();
// const groupIdGenerator = () => nanoid();
//
// const akaneStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
// const eliotStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
// const emilyStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
// const joeStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
//
//
//
//
// // Create serviceFactory
// let myPeer = new MyPeer('akano', users);
// const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
//   return new P2PChatService(storage, updateState, myPeer);
// };
//
//
//
//
//
// const akane = new User({
//   id: akaneModel.name,
//   presence: new Presence({status: UserStatus.Available, description: ""}),
//   firstName: "",
//   lastName: "",
//   username: akaneModel.name,
//   email: "",
//   avatar: akaneModel.avatar,
//   bio: ""
// });
//
// const emily = new User({
//   id: emilyModel.name,
//   presence: new Presence({status: UserStatus.Available, description: ""}),
//   firstName: "",
//   lastName: "",
//   username: emilyModel.name,
//   email: "",
//   avatar: emilyModel.avatar,
//   bio: ""
// });
//
// const eliot = new User({
//   id: eliotModel.name,
//   presence: new Presence({status: UserStatus.Available, description: ""}),
//   firstName: "",
//   lastName: "",
//   username: eliotModel.name,
//   email: "",
//   avatar: eliotModel.avatar,
//   bio: ""
// });
//
// const joe = new User({
//   id: joeModel.name,
//   presence: new Presence({status: UserStatus.Available, description: ""}),
//   firstName: "",
//   lastName: "",
//   username: joeModel.name,
//   email: "",
//   avatar: joeModel.avatar,
//   bio: ""
// });
//
// const chats = [
//   {name: "Akane", storage: akaneStorage},
//   {name: "Eliot", storage: eliotStorage},
//   {name: "Emily", storage: emilyStorage},
//   {name: "Joe", storage: joeStorage}
// ];
//
// function createConversation(id: ConversationId, name: string, userName: string): Conversation {
//   return new Conversation({
//     id,
//     participants: [
//       new Participant({
//         id: userName,
//         role: new ConversationRole([])
//       })
//     ],
//     unreadCounter: 0,
//     typingUsers: new TypingUsersList({items: []}),
//     draft: ""
//   });
// }
//
// // Add users and conversations to the states
// chats.forEach(c => {
//   users.forEach(u => {
//     if (u.name !== c.name) {
//       c.storage.addUser(new User({
//         id: u.name,
//         presence: new Presence({status: UserStatus.Available, description: ""}),
//         firstName: "",
//         lastName: "",
//         username: u.name,
//         email: "",
//         avatar: u.avatar,
//         bio: ""
//       }));
//       const conversationId = c.userName;
//       const myConversation = c.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === u.name) !== "undefined");
//       if (!myConversation) {
//         c.storage.addConversation(createConversation(conversationId, u.name, u.userName));
//         const chat = chats.find(chat => chat.name === u.name);
//         if (chat) {
//           const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
//           if (!hisConversation) {
//             chat.storage.addConversation(createConversation(conversationId, c.name));
//           }
//         }
//       }
//     }
//   });
// });
//
//
//
//
// function ChatApp(props) {
//
//   let userName = props.userName;
//   let storePlace = akaneStorage;
//   let user = akane;
//
//   return (
//       <ChatProvider serviceFactory={serviceFactory} storage={storePlace} config={{
//         typingThrottleTime: 250,
//         typingDebounceTime: 900,
//         debounceTyping: true,
//         autoDraft: AutoDraft.Save | AutoDraft.Restore
//       }}>
//         <Chat user={akane}/>
//       </ChatProvider>
//   );
// }
//
// export default ChatApp;



import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  BasicStorage,
  ChatMessage,
  ChatProvider,
  Conversation,
  ConversationId,
  ConversationRole,
  IStorage,
  MessageContentType,
  Participant,
  Presence,
  TypingUsersList,
  UpdateState,
  User,
  UserStatus
} from "@chatscope/use-chat";
import {P2PChatService} from "../chatService/IChatService.ts";
import Chat from "./Chat";
import {nanoid} from "nanoid";
import {Col, Container, Row} from "react-bootstrap";
import {akaneModel, eliotModel, emilyModel, joeModel, users} from "../data/data";
import {AutoDraft} from "@chatscope/use-chat/dist/enums/AutoDraft";
import MyPeer from "../handlers/PeerController";
import React from 'react'

// sendMessage and addMessage methods can automagically generate id for messages and groups
// This allows you to omit doing this manually, but you need to provide a message generator
// The message id generator is a function that receives message and returns id for this message
// The group id generator is a function that returns string
const messageIdGenerator = (message: ChatMessage<MessageContentType>) => nanoid();
const groupIdGenerator = () => nanoid();

const akaneStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
const eliotStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
const emilyStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
const joeStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});


const akane = new User({
  id: akaneModel.name,
  presence: new Presence({status: UserStatus.Available, description: ""}),
  firstName: "",
  lastName: "",
  username: akaneModel.name,
  email: "",
  avatar: akaneModel.avatar,
  bio: ""
});

const emily = new User({
  id: emilyModel.name,
  presence: new Presence({status: UserStatus.Available, description: ""}),
  firstName: "",
  lastName: "",
  username: emilyModel.name,
  email: "",
  avatar: emilyModel.avatar,
  bio: ""
});

const eliot = new User({
  id: eliotModel.name,
  presence: new Presence({status: UserStatus.Available, description: ""}),
  firstName: "",
  lastName: "",
  username: eliotModel.name,
  email: "",
  avatar: eliotModel.avatar,
  bio: ""
});

const joe = new User({
  id: joeModel.name,
  presence: new Presence({status: UserStatus.Available, description: ""}),
  firstName: "",
  lastName: "",
  username: joeModel.name,
  email: "",
  avatar: joeModel.avatar,
  bio: ""
});

let chats = [
  {name: "akane", storage: akaneStorage, object: akane},
  {name: "eliot", storage: eliotStorage, object: eliot},
  {name: "emily", storage: emilyStorage, object: emily},
  {name: "joe", storage: joeStorage, object: joe}
];
let objectUsers = {
  akane: akane,
  eliot: eliot,
  emily: emily,
  joe: joe
}
let storage = {
  akane: akaneStorage,
  eliot: eliotStorage,
  emily: emilyStorage,
  joe: joeStorage
}
function createConversation(id: ConversationId, name: string): Conversation {
  return new Conversation({
    id : name,
    participants: [
      new Participant({
        id: name,
        role: new ConversationRole([])
      })
    ],
    unreadCounter: 0,
    typingUsers: new TypingUsersList({items: []}),
    draft: ""
  });
}

// Add users and conversations to the states
chats.forEach(c => {

  users.forEach(u => {
    if (u.name !== c.name) {
      c.storage.addUser(new User({
        id: u.name,
        presence: new Presence({status: UserStatus.Available, description: ""}),
        firstName: "",
        lastName: "",
        username: u.name,
        email: "",
        avatar: u.avatar,
        bio: ""
      }));

      const conversationId = u.name;
      
      const myConversation = c.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === u.name) !== "undefined");
      if (!myConversation) {

        c.storage.addConversation(createConversation(u.name, u.name));

        const chat = chats.find(chat => chat.name === u.name);

        if (chat) {

          const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
          if (!hisConversation) {
            chat.storage.addConversation(createConversation(conversationId, c.name));
          }

        }

      }

    }
  });

});



export class ChatApp extends React.Component {
  // Create serviceFactory
  constructor(props) {
    super(props);

    this.userName = this.props.userName;


    console.log('hello' +  this.props.userName);
    this.serviceFactory = this.serviceFactory.bind(this);
  }

  serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new P2PChatService(storage, updateState, new MyPeer(this.userName, users));
  };
  render() {
    return (
        <ChatProvider serviceFactory={this.serviceFactory} storage={storage[this.userName]} config={{
          typingThrottleTime: 250,
          typingDebounceTime: 900,
          debounceTyping: true,
          autoDraft: AutoDraft.Save | AutoDraft.Restore
        }}>
          <Chat user={objectUsers[this.userName]}/>
        </ChatProvider>
    );
  }
}

export default ChatApp;
