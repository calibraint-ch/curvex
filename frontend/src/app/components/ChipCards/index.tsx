import React, { useState } from "react"
import { Modal, Radio, message, RadioChangeEvent } from 'antd';
import { QuestionCircle, BuySetting } from "../../../assets/images/imageAssets";

import "./index.scss";

type Cardprops = {
  title: string;
  value: string | number;
  handleSlippageChange?: (value: string | number) => void
};

const ChipCard = (props: Cardprops) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { title, value, handleSlippageChange } = props;

  const slippageOptions = ['0.1%', '0.5%', '1.0%'];

  const handleOnChange = (e: RadioChangeEvent) => {
    if (handleSlippageChange) {
      handleSlippageChange(e.target.value);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > 10) {
      messageApi.open({
        type: 'error',
        content: 'Value must not be greater than 10',
        style: {
          marginTop: '350px',
          marginLeft: '750px',
        },
      });
      return;
    }
    if (handleSlippageChange) {
      handleSlippageChange(value);
    }
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="chip-card">
      {contextHolder}
      <div>
        <p className="card-title">{title}</p>
        <p className="card-value">{value}</p>
      </div>
      <div className="slippage-modal">
        {props.title === "SLIPPAGE TOLERANCE" &&
          <div>
            <div>
              <img className="mb-4" src={QuestionCircle} alt="Question" />
              <img src={BuySetting} alt="Settings" onClick={showModal} className="image-curser mb-4"/>
            </div>
            <Modal title="Settings" open={isModalOpen} onCancel={handleCancel} footer={null} width={386} style={{ top: 460, marginLeft: 1080 }}>
              <p className="sub-title">Slippage Tolerance</p>
              <p className="label">Custom</p>
              <div className="modal-props">
                <Radio.Group className="slipage" options={slippageOptions} onChange={handleOnChange} optionType="button" buttonStyle="solid" />
                <div className="input-tab">
                  <input type="number" className="input-box number-input" onChange={handleInputChange} />
                </div>
              </div>
            </Modal>
          </div>
        }
      </div>
    </div>
  );
};

export default ChipCard;
