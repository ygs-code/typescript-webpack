import './index.scss';
import { FC, JSX } from 'react';
import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

interface TopTagProps {
    isOpen: boolean
    isShowRightBtn?: boolean
    switchOpen: () => void
    title?: string
    content?: string | JSX.Element,
    leftBtnSpan?: string
    rightBtnSpan?: string
    handleOk?: () => void
    handleCancel?: () => void
}

const ModalConfirm: FC<TopTagProps> = ({
    isOpen = false,
    isShowRightBtn = true,
    switchOpen = () => {},
    handleOk = () => {},
    handleCancel = () => {},
    ...props
}) => {
    const { t } = useTranslation()

    const { 
        title = t('Components.ModalConfirm.Hint'),
        content = '',
        leftBtnSpan = t('Components.ModalConfirm.Confirm'),
        rightBtnSpan = t('Components.ModalConfirm.Cancel')
    } = props

    return (
        <div className='modal-confirm-box'>
            <Modal
                open={isOpen}
                title={title}
                closable={false}    // 关闭按钮
                footer={
                    <>
                        <Button onClick={() => handleOk()} type="primary">{leftBtnSpan}</Button>
                        {isShowRightBtn && (<Button onClick={() => handleCancel()}>{rightBtnSpan}</Button>)}
                    </>
                }
            >
                {content}
            </Modal>
        </div>
    )
};

export default ModalConfirm