
import Peer from "peerjs";


export class MyPeer extends Peer {
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
            let connection = dataConnection;
        })
    }
    addHandlerForDc(dc, typeSerialization = 'json') {
        function handleData(data) {
            if (!window.g_dictMessage[data.sender]) window.g_dictMessage[data.sender]= [];
            window.g_dictMessage[data.sender].push(data);
            if (data.type == "file") {
                window.hash_name_file_table[data.hashKey] = data.message;
            }
            window.g_app.setState({flag: !window.g_app.state.flag});
            console.log('receive' + data);
        }
        dc.on('open', function() {
            dc.reliable = true; //
            dc.serialization = typeSerialization;
            console.log('dc open and isready to use');
            dc.on('data', handleData);
        });
    }
}