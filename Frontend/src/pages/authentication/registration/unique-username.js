import { Alert, Form, Button } from 'react-bootstrap';


<Alert className={{
    'username-availability-warning' : true,
    'visibility-hidden': this.state.usernameAvailable
}}  variant="danger">
    <strong>{this.state.username}</strong> is already taken, try another username.
</Alert>