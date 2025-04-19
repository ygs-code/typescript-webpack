// CounterComponent.js
import React, { Children, cloneElement } from 'react';
import Viewer from 'react-viewer';
import Upload from 'src/components/Upload/ui/index.tsx';
import { InboxOutlined, CameraOutlined } from '@ant-design/icons';
import idCardFront from '@/assets/images/idCardFront.png';
import idCardBack from '@/assets/images/idCardBack.png';
import passportFront from '@/assets/images/passportFront.png';
import passportBack from '@/assets/images/passportBack.png';
import { uploadImg } from '@/apis';


/*
ID
Passport

*/

export default (props) => {
    const {
        type = 'ID',
        value = {},
        onChange = () => { },
        readOnly,
    } = props;



    console.log('props===',props)


    let map = {
        ID: {
            frontUploadImg: idCardFront,
            frontText: '点击上传身份证正面图片',
            behindUploadImg: idCardBack,
            behindText: '点击上传身份证反面图片',
            frontType: 'frontOfIDCard',
            behindType: 'backOfIDCard',
        },
        Passport: {
            frontUploadImg: passportFront,
            frontText: '点击上传护照正面图片',
            behindUploadImg: passportBack,
            behindText: '点击上传护照信息图片',

            frontType: 'passportCover',
            behindType: 'passportInformation',
        }
    }




    const { frontImg, behindImg } = value

    return <div style={{
        display: 'flex',
    }}>
        <Upload
            readOnly={readOnly}
            maxLength={1}
            request={uploadImg}
            requestParame={
                {
                    type: map[type].frontType
                }
            }
            style={{
                width: '300px',
                height: '260px',
            }}
            value={
                frontImg ? [frontImg] : undefined
            }
            onChange={(v: any[] = []) => {
                onChange({
                    behindImg,
                    frontImg: v[0]
                })
            }}
        >
            <div className="ant-upload-drag-icon">
                <img
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: '20px',
                    }}
                    src={map[type].frontUploadImg}
                    alt=""
                />
                <div className="upload-icon">
                    <CameraOutlined
                        style={{
                            color: '#ccc',
                            fontSize: '20px',
                        }}
                    />
                    <span className="text">{map[type].frontText}</span>
                </div>
            </div>
        </Upload>


        <Upload
            readOnly={readOnly}
            maxLength={1}
            request={uploadImg}
            requestParame={
                {
                    type: map[type].behindType
                }
            }
            style={{
                width: '300px',
                height: '260px',
            }}
            value={
                behindImg ? [behindImg] : undefined
            }
            onChange={(v: any[] = []) => {
                onChange({
                    frontImg,
                    behindImg: v[0]
                })
            }}
        >
            <div className="ant-upload-drag-icon">
                <img
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: '20px',
                    }}
                    src={map[type].behindUploadImg}
                    alt=""
                />
                <div className="upload-icon">
                    <CameraOutlined
                        style={{
                            color: '#ccc',
                            fontSize: '20px',
                        }}
                    />
                    <span className="text">{map[type].behindText}</span>
                </div>
            </div>
        </Upload>

    </div>


};
