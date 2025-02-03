import {
    Button,
    Input,
    Divider,
    Tabs,
    Tab,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
  } from "@heroui/react";
  import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
  import {
    Form
  } from "@remix-run/react";
  import { Mail, Lock, DoubleCheck, Eye, EyeClosed, User } from "iconoir-react";
  import { useEffect, useMemo, useState } from "react";
  import {urlParameterWrapper} from "~/common";
//   import {useFetcherSubmit} from "~/components/hook";
  import {isNotificationContent} from "~/components/Notification";
  import {useNotification} from "~/components/NotificationContext";
  import {RequestMethod, sendRequest, shouldRedirect} from "~/lib/request";
import { checkLogin } from "~/services/user.server";
  import { commitSession, getSession } from "~/sessions";
  
  export default function Login() {
    const [email, setEmail] = useState<string>("");
    // const isInvalid = useMemo(() => {
    //   if (email === "") return false;
    //   // eslint-disable-next-line no-control-regex
    //   const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\$$\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])).){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)$$)$/i;
    //   return !String(email).match(emailRegex);
    // }, [email]);
  
    const [password, setPassword] = useState<string>("");
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const isInvalidPassword = useMemo(() => {
      if (password === "") return false;
      if (password.length < 8 || password.length > 20) return true;
      if (!/[a-z]/.test(password)) return true;
      if (!/[A-Z]/.test(password)) return true;
      if (!/[0-9]/.test(password)) return true;
      if (!/^[a-zA-Z0-9!@#$%^&*()_+-=]*$/.test(password)) return true;
      return false;
    }, [password]);
  
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
    const isInvalidConfirmPassword = useMemo(() => {
      if (confirmPassword === "") return false;
      return password !== confirmPassword;
    }, [confirmPassword, password]);
  
    const [isFirstTimeSend, setIsFirstTimeSend] = useState<boolean>(true);
    const [secondsLeft, setSecondsLeft] = useState<number>(0);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    useEffect(() => {
      if (secondsLeft > 0) {
        const interval = setInterval(() => {
          setSecondsLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
      } else {
        setIsFinished(true);
      }
    }, [secondsLeft]);
  
    const [username, setUsername] = useState<string>("");
    const isInvalidUsername = useMemo(() => {
      if (username === "") return false;
      if (username.length < 2 || username.length > 20) return true;
      if (!/^[A-Za-z0-9\u4E00-\u9FFF_.-]*$/.test(username)) return true;
      return false;
    }, [username]);
    
    const [account, setAccount] = useState<string>("");
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [isForgetPassword, setIsForgetPassword] = useState<boolean>(false);
    const [selectedLoginType, setSelectedLoginType] = useState<"id" | "username">("id");
    const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  
    const {notice} = useNotification();
    // const submitForm = useFetcherSubmit({
    //   intent: "submit",
    //   received: (data)=> {
    //     notice({
    //       id: Date.now(),
    //       code: 200,
    //       message: "操作成功",
    //     });
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-expect-error
    //     if (data?.isRefresh) {
    //       setIsForgetPassword(false);
    //       setIsRegister(false);
    //       setSelectedLoginType("password");
    //     }
    //   },
    //   type: "reactForm"
    // });
    // const submitEmail = useFetcherSubmit({
    //   intent: "submitEmail",
    //   received: ()=>{
    //     notice({
    //       id: Date.now(),
    //       code: 200,
    //       message: "操作成功",
    //     });
    //     setSecondsLeft(60);
    //     setIsFinished(false);
    //   },
    //   always: ()=>{
    //     setIsSendingEmail(false);
    //   }
    // });
  
    return (
      <div className="flex items-center justify-center gap-3 flex-col w-[calc(100vw-2em)] max-w-[700px] min-h-[calc(100vh-12em)]">
        <Card className="w-[calc(100vw-2em)] max-w-[400px] m-auto">
          <Form method="post" >{/*onSubmit={submitForm} */}
            <CardHeader className="flex gap-3">
              <p className="justify-start text-xl font-bold pl-2">
                {isRegister ? "注册" : isForgetPassword ? "忘记密码" : "登录"}
              </p>
            </CardHeader>
            <Divider />
            <CardBody className="pb-0 flex flex-col">
                    <>
                     

                    </>
                    

                <Tabs
                  fullWidth
                  size="md"
                  aria-label="Tabs form"
                  selectedKey={selectedLoginType}
                  onSelectionChange={key => setSelectedLoginType(key as "id" | "username")}
                  color="primary"
                >
                  <Tab key="email" title="使用学号" className="w-full mx-0 px-0">
                    <div className="flex flex-row items-center align-middle space-x-2">
                    <Input
                      value={account}
                      onValueChange={setAccount}
                      isRequired
                      endContent={
                        <div className="flex items-center">
                          <User />
                        </div>
                      }
                      label="学号"
                    //   type={passwordVisible ? "text" : "password"}
                      name="id"
                      placeholder="请输入你的学号"
                      variant="bordered"
                    />
                      {/* <Button color="primary" isLoading={!isFinished} type="submit" name="intent" value="sendCodeLogin" isDisabled={!isFinished  || isSendingEmail || email == ""} onClick={() => { //|| isInvalid
                        setIsSendingEmail(true);
                        setIsFirstTimeSend(false);
                        submitEmail({
                          email
                        },"sendCodeLogin")
                      }}>
                        <span>{ secondsLeft > 0 ? `${secondsLeft} S` : isFirstTimeSend ? "发送验证码" : "重新发送" }</span>
                      </Button> */}
                    </div>
                  </Tab>
                  <Tab key="password" title="使用用户名" className="w-full mx-0 px-0">
                    <Input
                      value={account}
                      onValueChange={setAccount}
                      isRequired
                      endContent={
                        <div className="flex items-center">
                          <User />
                        </div>
                      }
                      label="用户名"
                      type={passwordVisible ? "text" : "password"}
                      name="account"
                      placeholder="请输入你的用户名"
                      variant="bordered"
                    />
                   </Tab>
                 </Tabs>
              <Input
                value={password}
                onValueChange={setPassword}
                isRequired
                endContent={
                <div className="flex items-center">
                    <Button isIconOnly variant="light" size="sm" onClick={() => setPasswordVisible(prev => !prev)}>
                        {passwordVisible ? <Eye /> : <EyeClosed />}
                    </Button>
                    <Divider orientation="vertical" className="mx-1" />
                    <Lock />
                </div>
                }
                    label="密码"
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="请输入你的密码"
                    variant="bordered"
                />
            </CardBody>
            <Divider className="my-3" />
            <CardFooter className="flex justify-end pt-0">
              {isRegister ? (
                <div className="flex items-center justify-center space-x-4 pt-2">
                  <Button color="primary" variant="flat" onClick={() => setIsRegister(false)}>
                    返回登录
                  </Button>
                  <Button color="success" isDisabled={(isInvalidConfirmPassword || confirmPassword === "") || (isInvalidPassword || password === "")} type="submit" name="intent" value="register">
                    注册
                  </Button>
                </div>
              ) : isForgetPassword ? (
                <div className="flex items-center justify-center space-x-4 pt-2">
                  <Button color="primary" variant="flat" onClick={() => setIsForgetPassword(false)}>
                    返回登录
                  </Button>
                  <Button color="danger" isDisabled={(isInvalidConfirmPassword || confirmPassword === "") || (isInvalidPassword || password === "")} type="submit" name="intent" value="resetPassword">
                    重置密码
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center items-end space-x-4">
                  <div className="flex text-center items-center text-sm mb-2 md:mb-0 pr-2 md:pr-0 gap-1">
                    <Button color="primary" variant="light" className="text-sm" size="sm" onClick={() => setIsForgetPassword(true)}>忘记密码?</Button>
                    <p>或</p>
                    <p className="ml-1">还没有账户?</p>
                    <Button color="primary" variant="light" className="text-sm px-1" size="sm" onClick={() => setIsRegister(true)}>注册</Button>
                  </div>
                  <Button color="primary" type="submit" name="intent" value={selectedLoginType + "Login"} isDisabled={
                    account === "" || password === "" // && selectedLoginType=== "password"|| isInvalid 
                  }>
                    登录
                  </Button>
                </div>
              )
              }
            </CardFooter>
          </Form>
        </Card>
      </div>
      // TODO: add captcha
    );
  }
  
//   async function redirectWithToken(request: Request, token: string, init?: number | ResponseInit) {
//     const searchParams = new URL(request.url).searchParams;
//     const from = searchParams.get("from");
//     if (from) {
//       return redirect(urlParameterWrapper(from,{
//         ...(searchParams.has("redirectWithToken") && searchParams.get("redirectWithToken") === "true"
//           ? {token}
//           : {}
//         ),
//       }), init);
//     }
//     return redirect("/info", init);
//   }
  
  export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get("Cookie"));
    // if (session.has("token")) {
    //   return redirectWithToken(request, session.get("token") as string);
    // }
    return null;
  }
  
  export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const session = await getSession(request.headers.get("Cookie"));
    
    const req = {
      url: "",
      body: {},
    }
  
    let isRefresh = false;
    let saveToken = false;
  
    const intent = formData.get("intent");
    const loginSuccessful = await checkLogin(formData);
    console.log(loginSuccessful  )
    console.log(formData)
    if(loginSuccessful!=null){
        if (loginSuccessful) {
            console.log(111)
            return(1);
        }
        else{
            console.log(222)
            return json({message: "登录失败，请检查用户名和密码是否正确"});
        }
    }
    return 1;
    // if(intent === "")

    // if (intent === "register") {
    //   req.url = "auth/register";
    //   req.body = {
    //     username: formData.get("username"),
    //     password: formData.get("password"),
    //     email: formData.get("email"),
    //     code: formData.get("code"),
    //   };
    //   isRefresh = true;
    // } else if (intent === "resetPassword") {
    //   req.url = "auth/resetPassword";
    //   req.body = {
    //     email: formData.get("email"),
    //     code: formData.get("code"),
    //     password: formData.get("password"),
    //   };
    //   isRefresh = true;
    // } else if (intent === "emailLogin") {
    //   req.url = "auth/loginByCode";
    //   req.body = {
    //     email: formData.get("email"),
    //     code: formData.get("code"),
    //   };
    //   saveToken = true;
    // } else if (intent === "passwordLogin") {
    //   req.url = "auth/login";
    //   req.body = {
    //     email: formData.get("email"),
    //     password: formData.get("password"),
    //   };
    //   saveToken = true;
    // } else if (intent === "sendCodeLogin") {
    //   req.url = "auth/sendEmailCode";
    //   req.body = {
    //     email: formData.get("email"),
    //     usage: "LOGIN",
    //   };
    //   saveToken = true;
    // } else if (intent === "sendCodeRegister") {
    //   req.url = "auth/sendEmailCode";
    //   req.body = {
    //     email: formData.get("email"),
    //     usage: "REGISTER",
    //   };
    // } else if (intent === "sendCodeReset") {
    //   req.url = "auth/sendEmailCode";
    //   req.body = {
    //     email: formData.get("email"),
    //     usage: "RESET_PASSWORD",
    //   };
    // }
  
    // const res = await sendRequest({
    //   request,
    //   method: RequestMethod.POST,
    //   ...req,
    // });
  
    // if(shouldRedirect(res)){
    //   return res;
    // }
  
    // if(saveToken && res?.token){
    //   // 这么写的原因是token被commitSession后需要跳转页面生效，但服务端session已经更新了，不进行判断会导致loader里面的session.has卡死
    //   session.set("token", res.token);
    //   return redirectWithToken(request, res.token,{
    //     headers: {
    //       "Set-Cookie": await commitSession(session),
    //     },
    //   });
    // }
  
    // // 不能回传notificationContent否则被判定为error
    // return json(
    //   isNotificationContent(res) ? res : { isRefresh },
    //   {
    //     headers: {
    //       "Set-Cookie": await commitSession(session),
    //     },
    //   }
    // );
  }