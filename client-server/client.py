import socket
import threading
import json
from packet import *

HOST = 'localhost'
PORT = 5555

def toString(msg):
    jsonMsg = json.dumps(msg.__dict__)
    return json.dumps(jsonMsg)

def toDict(msg):
    return json.loads(json.loads(msg))

def createMsg(typeNum, targetUser = '', contentType = '', content = ''):
    return Message(typeNum, targetUser, contentType, content)

def listenForMessages(client):
    while 1:
        message = client.recv(2048).decode('utf-8')
        if message != '':
            sender = message.split('>>')[0]
            content = message.split('>>')[1]
            print(f'{sender}>>{content}')
            if 'added' not in content:
                jsonMsg = toDict(content)
                print(f'Content converted to JSON: \n {jsonMsg}')
        else:
            print(f'Received message from client is empty')

def send(client, username, msg):
    msgStr = toString(msg)
    # print(msgStr)
    client.send(f'{username}>>{msgStr}'.encode('utf-8'))

def sendToServer(client, username):
    while 1:
        # msg = input('Message: ')
        # if msg != '':
        #     client.send(msg.encode('utf-8'))
        # else:
        #     print('Empty message')
        #     exit(0)
        
        typeNum = int(input('Enter message type following msgType in packet.py to test: '))
        msg = None
        if typeNum == 1:
            msg = createMsg(typeNum, username)
        elif typeNum == 2:
            targetName = input('Enter friend name: ')
            msg = createMsg(2, username, targetName)
        elif typeNum == 3 | typeNum == 4:
            targetName = input('Enter friend name: ')
            sdpContent = input('sdp: ')
            msg = createMsg(typeNum, username, targetName, 'sdp', sdpContent)
        elif typeNum == -1:
            break
        send(client, username, msg)
        

def communicateToServer(client):
    username = input('Enter username: ')
    if username != '':
        client.send(username.encode('utf-8'))
    else:
        print(f'Username cannot be empty')
        exit(0)
    threading.Thread(target=listenForMessages, args=(client, )).start()
    sendToServer(client, username)
    client.close()

def main():
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        client.connect((HOST, PORT))
        print(f'You are connected to server {HOST}')
    except:
        print(f'Unable to connect to server')
        exit(0)
    
    communicateToServer(client) # threading for this function if you want to 
                                #connect to multiple server or peer

if __name__ == '__main__':
    main()