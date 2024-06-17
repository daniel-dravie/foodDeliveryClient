import { useContext, useState } from "react";
import { auth, db } from "../helpers/firebase";
import { AuthContext } from "../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  Button,
  InputAdornment,
  Snackbar,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Grid from "@mui/material/Grid";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      dispatch({ type: "LOGIN", payload: user });
      navigate(`/dashboard/${user.uid}`);
    } catch (error) {
      console.error("Error signing in:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ height: "95vh" }}>
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item>
            <Typography
              variant="h5"
              component="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              LOGIN
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              size="small"
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Person />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              size="small"
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ marginBottom: "10px" }}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </Button>
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        </Grid>
      </Container>
      <TextField
        value={count}
        onChange={(e) => {
          setCount(e.target.value);
          console.log(count);
        }}
      />
    </>
  );
};

export default Login;
