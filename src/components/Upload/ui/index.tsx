// CounterComponent.js
import React, { Children, cloneElement, createElement } from 'react';
import useHook from '../hook';
import './index.scss';
import { InboxOutlined, CameraOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, Spin, Popconfirm } from 'antd';
import Viewer from 'react-viewer';
import idCardBack from '@/assets/images/idCardBack.png';
import idCardFront from '@/assets/images/idCardFront.png';
import dd from '@/assets/images/404.png';
import { CheckDataType } from '@/utils';
import { useTranslation } from 'react-i18next';


const { Dragger } = Upload;

interface Props {
    type?: string;
    value?: any[];
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    style?: any;
    onChange?: (v: any[]) => void;
    children?: any;
}


export default (props: Props) => {
    const { t } = useTranslation()

    const {
        type = 'front',
        value = [],
        placeholder,
        disabled,
        maxLength = 3,
        style = {},
        onChange = () => { },
        children = [],
        readOnly,
    } = props;

    const { status } = value[0] || {};

    const {
        onChangeFile,
        startUpload,
        fileUpload,
        isImg,
        getFileReader,
        verify,
        getFormParameter,
    } = useHook(props);

    const [previewImage, setPreviewImage] = React.useState<{
        visible: boolean;
        urls: { src: string; alt: string }[];
    }>({
        visible: false,
        urls: [],
    });

    const UploadProps = {
        name: 'file',
        multiple: true,
        showUploadList: false, // 隐藏上传列表和进度条
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',

        // 只要这里就行了
        customRequest: ({ file, onSuccess }) => {
            onChangeFile(file);
            setTimeout(() => {
                onSuccess('ok');
            }, 1000);
        },

        // 上传成功
        onChange() {
            // const { status } = info.file;
            // if (status !== 'uploading') {

            // }
            // if (status === 'done') {
            //     message.success(`${info.file.name} file uploaded successfully.`);
            // } else if (status === 'error') {
            //     message.error(`${info.file.name} file upload failed.`);
            // }
        },
        onDrop(e) {

        },
    };




    return (
        <div className="multiple-file-upload">
            <Viewer
                visible={previewImage.visible}
                onClose={() => {
                    setPreviewImage({
                        visible: false,
                        urls: [],
                    });
                }}
                images={previewImage.urls}
            />

            {value.map((item: {
                url: string;
                type: string;
                status: string;
                name: string;
            }, index: number) => {
                const { url, type = 'image', status, name } = item;


                return (
                    <div style={style} className="item" key={index}>
                        <span className="  ant-upload-wrapper css-dev-only-do-not-override-1ourjq3">
                            <div className=" ant-upload ant-upload-drag  css-dev-only-do-not-override-1yng9lm   ant-upload-list-item-info file-box">

                                <div className={`${status == 'error' ? "over-icon error" : "over-icon"}`} >
                                    <div>

                                        {isImg(type) ? (
                                            <i

                                                onClick={() => {
                                                    setPreviewImage({
                                                        visible: true,
                                                        urls: [{ src: url, alt: name }],
                                                    });
                                                }}
                                                aria-label="图标: eye-o"
                                                className="anticon anticon-eye-o viwe-icon">
                                                <svg
                                                    viewBox="64 64 896 896"
                                                    focusable="false"
                                                    className=""
                                                    data-icon="eye"
                                                    width="2em"
                                                    height="2em"
                                                    fill="currentColor"
                                                    aria-hidden="true">
                                                    <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                                                </svg>
                                            </i>
                                        ) : null}
                                        {disabled || readOnly ? null : (
                                            <Popconfirm
                                                key={value.length}
                                                title="提示"
                                                description="确定要删除图片么?"
                                                onConfirm={() => {
                                                    value.splice(index, 1);


                                                    onChange([...value]);
                                                    // onChange([...value])
                                                }}>
                                                <i

                                                    onClick={() => {

                                                        value.splice(index, 1);
                                                        // open
                                                        // onChange([...value])
                                                        // onChange([...value])
                                                    }}
                                                    aria-label="图标: delete"
                                                    title="删除文件"
                                                    className="anticon anticon-delete delete-icon">
                                                    <svg
                                                        viewBox="64 64 896 896"
                                                        focusable="false"
                                                        className=""
                                                        data-icon="delete"
                                                        width="em"
                                                        height="2em"
                                                        fill="currentColor"
                                                        aria-hidden="true">
                                                        <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                                                    </svg>
                                                </i>
                                            </Popconfirm>
                                        )}
                                    </div>
                                    {
                                        status == 'error' ? <div color='error'>图片上传错误</div> : null
                                    }
                                </div>





                                {status === 'uploading' || status === 'error' ? (
                                    <>
                                        <div className="mask"></div>
                                        {
                                            status === 'uploading' ? <div className="icon-box">
                                                <i
                                                    aria-label="图标: plus"
                                                    className="anticon anticon-plus">
                                                    <svg
                                                        viewBox="0 0 1024 1024"
                                                        focusable="false"
                                                        className="anticon-spin"
                                                        data-icon="loading"
                                                        width="2em"
                                                        height="2em"
                                                        fill="currentColor"
                                                        aria-hidden="true">
                                                        <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
                                                    </svg>
                                                </i>
                                            </div> : null
                                        }


                                    </>
                                ) : null}
                                <img src={url} alt="" className="img" />
                            </div>
                        </span>
                    </div>
                );
            })}


            {
                value.length >= maxLength || disabled || readOnly ? null : <div style={style} className="item">
                    <Dragger {...UploadProps}>
                        {
                            Children.count(children) ? Children.map(children, (child, index) => {
                                return cloneElement(child, {
                                    key: index
                                });
                            }) : <div className="ant-upload-drag-icon">
                                <PlusOutlined style={{
                                    fontSize: '28px',
                                    color: '#49505E',
                                }} />
                                <div className="upload-icon">
                                    {/* 上传图片 */}
                                    <span className="text">{t('Components.Upload.UploadPictures')}</span>
                                </div>
                            </div>

                        }
                    </Dragger>
                </div>
            }






        </div>
    );
};