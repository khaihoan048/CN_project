import {Peer} from "peerjs"
import { IChatService } from "@chatscope/use-chat";
import { ChatEventType, MessageContentType, MessageDirection } from "@chatscope/use-chat";
import {
  ChatEventHandler,
  SendMessageServiceParams,
  SendTypingServiceParams,
  UpdateState,
} from "@chatscope/use-chat";
import { IStorage } from "@chatscope/use-chat";
import { ChatEvent, MessageEvent, UserTypingEvent } from "@chatscope/use-chat";
import { ChatMessage } from "@chatscope/use-chat";






const CONFIG = {'iceServers': [
  { url: 'stun:stun.l.google.com:19302' },
  // {
  //     urls: "stun:openrelay.metered.ca:80",
  // },
  {
      urls: "turn:openrelay.metered.ca:80?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
  },
  // {
  //     urls: "turn:openrelay.metered.ca:443",
  //     username: "openrelayproject",
  //     credential: "openrelayproject",
  // },
  // {
  //     urls: "turn:openrelay.metered.ca:443?transport=tcp",
  //     username: "openrelayproject",
  //     credential: "openrelayproject",
  // }
]};

export default class MyPeer extends Peer {
  constructor(userName, listFriend = []) {
    super(userName, {config: CONFIG});
    this.dataConnectionDict = new Map();
    this.on('open', function(id) {console.log('open ' + id)});
    this.on('disconnected', () => {
      while (this.disconnected) {
        this.reconnect();
      }
    });
    this.on('connection', function(dataConnection) {
      this.dataConnectionDict[dataConnection.peer] = dataConnection;
      let dc = this.dataConnectionDict[dataConnection.peer];
      this.addHandlerForDc(dc);
      console.log('receive connection from remote peer');
    });
    this.listFriend = listFriend;
  }

  addHandlerForDc(dc) {
    dc.on('open', function() {
      console.log('dc is readyToUse');
      dc.on('data', function(data) {
        window.dispatchEvent(data);
        console.log('receive' + data);
      });
    });
    dc.on('data', function(data) {
      window.dispatchEvent(data)
      console.log('receive' + data);
    });
    dc.on('error', function(err) {
      console.log('receive error' + err);
    });
  }
}
