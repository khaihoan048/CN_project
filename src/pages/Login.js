// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import '../css/login.css'
// import Axios from "axios";
//
// const HOST = "http://localhost:";
// const PORT = 8001;
//
// function Login() {
//     const [username, setUsername] = useState();
//     const [password, setPassword] = useState();
//     const [user, setUser] = useState();
//     const [userState, setUserState] = useState(null);
//     const [show, setShow] = useState(false);
//     const [errMsg, setErrMsg] = useState();
//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);
//
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         if (userState) {
//             navigate("/chat");
//         }
//     }, [userState])
//
//     useEffect(() => {
//         const loggedInUserId = localStorage.getItem("id");
//         const loggedInName = localStorage.getItem("name");
//         const loggedInUserName = localStorage.getItem("username");
//         if (loggedInUserId) {
//             setUser({
//                 id: loggedInUserId,
//                 name: loggedInName,
//                 username: loggedInUserName
//             });
//             setUserState(true);
//         }
//     },[]);
//
//     const handleLogin = (e) => {
//         e.preventDefault();
//         Axios.get(HOST + PORT + "/api/authentication", {
//             params: {username: username, password: password}
//         }).then((response) => {
//             console.log("response: ", response.data);
//             let data = response.data
//             if (data.success == true) {
//                 localStorage.setItem('id', response.data.id);
//                 localStorage.setItem('name', response.data.name);
//                 localStorage.setItem('username', response.data.username);
//                 setUser({
//                     id: response.data.id,
//                     name: response.data.name
//                 });
//                 setUserState(true);
//             }
//             else {
//                 setErrMsg(response.data.error);
//                 handleShow();
//             }
//         });
//     }
//
//     return (
//         <div className="wrapper fadeInDown">
//             <Modal show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Notice</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>{errMsg}</Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleClose}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//
//             <div id="formContent">
//                 <form>
//                     <input type="text" id="login" className="fadeIn second" placeholder="Username"
//                            onChange={(e) => setUsername(e.target.value)}/>
//                     <input type="password" id="password" className="fadeIn third" placeholder="Password"
//                            onChange={(e) => setPassword(e.target.value)}/>
//                     <input type="submit" value="Log In" onClick={(e) => {handleLogin(e)}}/>
//                 </form>
//                 <div id="formFooter">
//                     <a className="underlineHover" onClick={(e) => navigate("/signup")}>Register</a>
//                 </div>
//             </div>
//         </div>
//     );
// }
// export default Login;



import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';



const theme = createTheme();

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.parentApp);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setParentApp = this.setParentApp.bind(this);
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let username = data.get('username');
        let password = data.get('password');
        this.userName = username;
        window.g_userName = username;
        this.setParentApp({userName: this.userName, pageType : 'chat'});
    };

    setParentApp(infoObject) {
        this.props.parentApp.setChatPage();
        this.props.parentApp.setUserInfo(infoObject);
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="User Name"
                                name="username"
                                autoComplete="username"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        )
    }
};