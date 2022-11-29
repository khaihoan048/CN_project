from enum import Enum
class description:
    def __init__(self, _typ, _name, _target, _sdp):
        self.typ = _typ
        self.name = _name
        self.target = _target
        self.sdp = _sdp

class MsgType (Enum):
    signal = 1 #for active state
    addFriend = 2 # addFriend
    offer = 3 # send offer to target user
    answer = 4 #send answer
    sendFile = 5 # send file
    normal = 6 # send normal text

class Message:
    def __init__(self, _msgType, _from, _to = '', _contentType = '', _content = ''):
        self.messageType = _msgType
        self.sender = _from
        self.targetUser = _to
        self.contentType = _contentType
        self.content = _content
        
    def getContent(self):   
        return self.content

    def getType(self):
        return self.typ

    def getUserName(self):
        return self.usename
