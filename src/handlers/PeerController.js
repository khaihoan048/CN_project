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

const CONFIG = window.g_iceconfig;
export default class MyPeer extends Peer {
  constructor() {
    super(window.g_userName, {config : window.g_iceconfig});
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
        console.log('succesful reconnect to peerjs server:? ' + !this.disconnected);
      }
    });

    this.on('connection', function(dataConnection) {
      this.dataConnectionDict[dataConnection.peer] = dataConnection;
      let dc = this.dataConnectionDict[dataConnection.peer];
      this.addHandlerForDc(dc);
      console.log('receive connection from remote peer');
    });
  }

  addHandlerForDc(dc) {
    function handleData(data) {
        let event = new CustomEvent("chat-protocol", data);
        window.dispatchEvent(event);
        console.log('receive' + data);
    }
    dc.on('open', function() {
        dc.reliable = true; //
        dc.serialization = 'json';
        console.log('dc open and isready to use');
        dc.on('data', handleData);
    });
    dc.on('data', handleData);


  }
}
