import SliderCaptcha from "rc-slider-captcha";
import {Modal} from "antd";

const Captcha = ({isModalOpen, setIsModalOpen, verify}: any) => {


  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      title="安全验证"
      footer={false}
      centered
      width={368}
      style={{ maxWidth: '100%' }}
    >
      <SliderCaptcha
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
}

export default Captcha;