import { gql, useMutation } from "@apollo/client";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { logUserIn } from "../apollo";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import Separator from "../components/auth/Separator";
import PageTitle from "../components/PageTitle";
import routes from "../routes";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const Notification = styled.div`
  color: #2ecc71;
`;

const LOGIN_MUTATION = gql`
  mutation login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      ok
      token
      error
    }
  }
`;

function Login() {
  const location = useLocation();
  const {
    register,
        watch,
        handleSubmit,
        errors,
        formState,
        getValues,
        setError,
        clearErrors,
      } = useForm({
        mode: "onChange",
        defaultValues: {
          userName: location?.state?.userName || "",
          password: location?.state?.password || "",
        }
      });
    const onCompleted = (data) => {
        const {
          login: { ok, error, token },
        } = data;
        if (!ok) {
          setError("result", {
            message: error,
          });
        }
        if(token){
            logUserIn(token);
        }
      };
    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted,
      });
    const onSubmitValid = (data) => {
        if (loading) {
          return;
        }
      const { userName, password } = getValues();
        login({
          variables: { userName, password },
        });
      };
    const clearLoginError = () => {
          clearErrors("result")
      }       
    return (
        <AuthLayout>
            <PageTitle title="Login" />
            <FormBox>
                <div>
                    <FontAwesomeIcon icon={faInstagram} size="3x" />
                </div>
                <Notification>{location?.state?.message}</Notification>
                <form onSubmit={handleSubmit(onSubmitValid)}>
                    <Input ref={register({
                        required: "Username is required.",
                        minLength: {
                            value: 5,
                            message:"Username should be longer than 5 chars."
                        },
                        // pattern: "", <- 이메일 형식, 숫자 형식 등을 설정할 수 있음
                        // validate: (currentValue) => currentValue.includes("potato") <- 문자안에 potato를 포함시켜라 async를 사용하여 db와 연결 후 아이디 사용여부 체크가능
                    })}
                    onChange={clearLoginError} name="userName" type="text" placeholder="Username" hasError={Boolean(errors?.userName?.message)} />
                    <FormError message={errors?.userName?.message} /> 
                    <Input ref={register({
                        required: "Password is required.",
                    })}
                    onChange={clearLoginError} name="password" type="password" placeholder="Password" hasError={Boolean(errors?.password?.message)} />
                    <FormError message={errors?.password?.message} />
                    <Button type="submit" value={loading ? "Loading..." : "Log in"} disabled={!formState.isValid || loading} />
                    <FormError message={errors?.result?.message} />
                </form>
                <Separator />
                <FacebookLogin>
                    <FontAwesomeIcon icon={faFacebookSquare} />
                    <span>Log in with Facebook</span>
                </FacebookLogin>
            </FormBox>
            <BottomBox
                cta="Don't have an account?"
                linkText="Sign up"
                link={routes.signUp}
            />
        </AuthLayout>
    );
}
export default Login;