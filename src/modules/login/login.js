import { useState, useEffect } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import loginBackground from "src/img/login-bg.jpeg";
import Form from "src/components/form";
import Button from "src/components/button/button";
import axios from "axios";
import Toaster from "src/atoms/toaster";
import logo from "src/img/logo-md.png";
import "./login.scss";

function Login() {
  const [form, setForm] = useState({
    UserName: "",
    Password: "",
  });
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const isLogin = sessionStorage.getItem("auth");
    if (isLogin) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  function handleInputChange(value, id) {
    setForm((prevState) => ({ ...prevState, [id]: value }));
  }

  function handleFormSubmit() {
    if (_.isEmpty(_.pickBy(form, _.identity))) {
      setMessage("Please enter username and password");
      setType("error");
      return;
    }

    axios
      .post("/user/login", {
        ...form,
      })
      .then((response) => {
        const res = response.data;
        if (res.status === 200) {
          sessionStorage.setItem("auth", res.token);
          navigate("/dashboard", { replace: true });
        } else {
          setMessage(res.message);
          setType("info");
        }
      })
      .catch(function (error) {
        setMessage(error.message);
        setType("error");
      });
  }

  return (
    <>
      <div className="container login-wrapper">
        <div className="login-box">
          <div
            className="login-box__left"
            style={{
              backgroundImage: `url(${loginBackground})`,
            }}
          >
            <h1 className="title">NSE</h1>
            <h2 className="subtitle">Stock Analysis</h2>
            <p className="caption">Indias best stock analysis tools</p>
          </div>
          <div className="login-box__right">
            <div className="image-wrapper">
              <img src={logo} alt="NSE Stock Analysis" width="150" />
            </div>
            <h2 className="page-title">Login</h2>

            <Form onSubmit={handleFormSubmit} isLoginForm>
              <Form.Body>
                <Form.Input
                  id="UserName"
                  value={form.UserName}
                  label="Username"
                  onChange={handleInputChange}
                />
                <Form.Input
                  id="Password"
                  value={form.Password}
                  label="Password"
                  type="password"
                  onChange={handleInputChange}
                />
              </Form.Body>
              <Form.Actions>
                <Button>Login</Button>
              </Form.Actions>
            </Form>
          </div>
        </div>
      </div>
      {message && <Toaster type={type} message={message} />}
    </>
  );
}

export default Login;
