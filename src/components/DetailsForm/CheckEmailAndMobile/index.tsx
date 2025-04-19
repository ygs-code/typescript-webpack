import "./index.scss";
import { Button, Modal, Space } from 'antd';

import { FC, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';


interface CheckEmailAndMobileProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  modalProps: any
}

const CheckEmailAndMobile: FC<CheckEmailAndMobileProps> = ({
  isOpen = false,
  setIsOpen = () => {},
  modalProps = () => {}
}) => {

  const { t } = useTranslation()


  const switchOpen = () => setIsOpen(!isOpen);



  return (
    <>
      <Modal
        title={t("Pages.PersonalInfoWrite.Confirm")} //确认
        open={isOpen}
        onOk={switchOpen}
        onCancel={switchOpen}
        okText={t("Pages.PersonalInfoWrite.Confirm")} //确认
        cancelText={t("Pages.PersonalInfoWrite.Cancel")} //取消
        {...modalProps}
      >
      </Modal>
    </>
  )
}


export default CheckEmailAndMobile