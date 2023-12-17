import {Button, Input} from "antd";
import {MailOutlined} from "@ant-design/icons";

const RegisterMain = () => {
  return (
    <div>
      <Input placeholder="用户名"/>
      <Input.Password placeholder="密码"/>
      <Input.Password placeholder="确认密码"/>
      <Input placeholder="邮箱" prefix={<MailOutlined/>}/>
      <div>
        <Input placeholder="验证码"/>
        <Button type="link">获取验证码</Button>
      </div>
      <Button>注册</Button>
    </div>
  );
}

export default RegisterMain;