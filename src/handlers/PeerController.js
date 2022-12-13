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




console.log('dddd');

const CONFIG = window.g_CONFIG;
export default class MyPeer extends Peer {
  constructor(userName = null) {
    if (!userName) {
      super({config: CONFIG});
    }
    else {
      super(userName, {config: CONFIG});
    }
    this.isOpen = false;
    console.log('create peer');
    this.dataConnectionDict = {};
    this.on('open', function(id) {
      console.log('open ' + id);
      this.isOpen = true;
    });
    this.on('disconnected', () => {
      while (this.disconnected) {
        console.log('disconnect');
        this.reconnect();
        console.log('connect to peerjs server:? ' + !this.disconnected);
      }
    });
    this.on('connection', function(dataConnection) {
      this.dataConnectionDict[dataConnection.peer] = dataConnection;
      let dc = this.dataConnectionDict[dataConnection.peer];
      this.addHandlerForDc(dc);
      console.log('receive connection from remote peer');
    });
    this.curMessage ='';
  }

  addHandlerForDc(dc) {
    dc.on('open', function() {
      console.log('dc is readyToUse');
      window.dispatch('temp_peer_is_open');
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
