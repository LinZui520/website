import SliderCaptcha, {ActionType} from "rc-slider-captcha";
import {Modal} from "antd";
import React from "react";
import { CaptchaData } from "../../hooks/user/useUserRegister";


interface CaptchaProps {
  actionRef: React.MutableRefObject<ActionType | undefined>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  verify: (data: CaptchaData) => Promise<void>;
}

const Captcha: React.FC<CaptchaProps> = React.memo(({actionRef, isModalOpen, setIsModalOpen, verify}) => {

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      title="安全验证"
      footer={false}
      centered
      width={368}
      className={"max-w-[100%]"}
    >
      <SliderCaptcha
        actionRef={actionRef}
        mode="slider"
        className={"rounded-3xl"}
        tipText={{
          default: '请按住滑块，拖动到最右边',
          moving: '请按住滑块，拖动到最右边',
          error: '验证失败，请重新操作',
          success: '验证成功'
        }}
        onVerify={(data) => verify(data)}
      />
    </Modal>
  );
})

export default Captcha;