import "./index.scss"
import React, { Fragment, useState, useEffect } from 'react';
import { Spin, Button, Form, Input, Select, Radio, DatePicker, Image } from 'antd';
import { addRouterApi } from 'src/router';

import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { CameraOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { DetailsFormProps } from '@/types/detailsForm'
import CheckEmailAndMobile from "./CheckEmailAndMobile";
import CertificateUpload from "src/pages/PersonalInfoWrite/CertificateUpload";
import Upload from 'src/components/Upload/ui/index';
import { uploadImg } from "src/apis";
// import CertificateUpload from "src/pages/PersonalInfoWrite/CertificateUpload";

// type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

// 解构出组件
const { TextArea } = Input;

const DetailsForm: React.FC<DetailsFormProps> = ({
  formItemPropData = [],
  formProps = {
    name: 'formName',
    disabled: false,
    validateMessages: {},
    form: Form.useForm()[0], // 确保传递 form 实例
    labelCol: { span: 12 },
    wrapperCol: { span: 24 },
    style: { maxWidth: 482 },
    layout: 'vertical', //layout="vertical | horizonta | linline"
    onFinish: () => { },
    initialValues: {}
  },
  // 选中的支付方式下标
  checkPayWayIndex = -1,
  // 禁用表单
  formDisabled = false,
  //只读
  formReadOnly = false,
  //加载中
  formLoading = false,
}) => {

  return (
    <div className="details-form-main">
      <Spin spinning={formLoading} size="large">
        <Form
          disabled={formDisabled}
          {...formProps}
        >
          {
            // 循环遍历出Form各个Item
            formItemPropData && formItemPropData.length > 0 && formItemPropData.map((item, index) => (

              (() => {
                const itemProps = item[0]
                const scopeData = item[1]
                // console.log(itemProps, 'itemProps', scopeData, 'scopeData')

                switch (scopeData.type) {
                  //普通输入框
                  case 'Input':
                    return (
                      <div className="main-input" key={index}>
                        <Form.Item {...itemProps} key={Array.isArray(itemProps) ? index : itemProps.name}>
                          <Input
                            disabled={formDisabled}
                            readOnly={formReadOnly}
                            variant={formReadOnly ? 'borderless' : 'outlined'}
                            style={{ height: '40px' }}
                            {...scopeData.props}
                          />
                        </Form.Item>
                      </div>
                    );
                  //多个输入框
                  case 'MultipleInputs':
                    return (
                      <div className="multiple-inputs-div" key={index}>
                        {scopeData.options?.map((option, idx) => (
                          // 为每个内部循环的div添加唯一key，使用外层index和当前idx组合确保唯一性
                          <div className="multiple-inputs" key={`${index}-${idx}`}>
                            {Array.isArray(itemProps) && (
                              // 确保Form.Item的key也唯一，假设itemProps[idx].name是唯一的
                              <Form.Item {...itemProps[idx]} key={itemProps[idx].name}>
                                <Input
                                  disabled={formDisabled}
                                  readOnly={formReadOnly}
                                  variant={formReadOnly ? 'borderless' : 'outlined'}
                                  style={{ height: '40px' }}
                                  {...option.props}
                                />
                              </Form.Item>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  //密码输入框
                  case 'PasswordInput':
                    return (
                      <Form.Item {...itemProps} key={Array.isArray(itemProps) ? index : itemProps.name}>
                        <div>
                          <Input.Password
                            disabled={formDisabled}
                            readOnly={formReadOnly}
                            variant={formReadOnly ? 'borderless' : 'outlined'}
                            placeholder="input password"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            style={{ height: '40px' }}
                            {...scopeData.props}
                          />
                          {
                            scopeData.showSpan &&
                            (<div className="input-span-div">
                              <span className="input-span-require">* </span>
                              <span className="input-span-content">{scopeData.spanContent}</span>
                            </div>)
                          }
                        </div>
                      </Form.Item>
                    );
                  //金额Input
                  // case 'AmountInput':
                  //   return (
                  //     <Fragment key={index}>
                  //       <Form.Item {...itemProps}>
                  //         <Input
                  //           style={{ height: '40px' }}
                  //           {...scopeData.props}
                  //         />
                  //       </Form.Item>
                  //     </Fragment>
                  //   );
                  //数字input
                  case 'NumberInput':
                    return (
                      <Fragment key={index}>
                        <Form.Item {...itemProps} key={Array.isArray(itemProps) ? index : itemProps.name}>
                          <Input
                            disabled={formDisabled}
                            readOnly={formReadOnly}
                            variant={formReadOnly ? 'borderless' : 'outlined'}
                            style={{ height: '40px' }}
                            // pattern="[0-9]*"
                            {...scopeData.props}
                          />
                        </Form.Item>
                      </Fragment>
                    );
                  // 手机号输入框
                  case 'PhoneInput':
                    return (
                      <div className="phone-input-main" key={index}>
                        {Array.isArray(itemProps) && <Form.Item {...itemProps[0]} key={itemProps[0].name}>
                          <>
                            <Input
                              disabled={formDisabled}
                              readOnly={formReadOnly}
                              variant={formReadOnly ? 'borderless' : 'outlined'}
                              style={{ height: '40px' }}  //样式在ant-input覆盖
                              // pattern="[0-9]*"
                              {...scopeData.options[0].props}
                              addonBefore={(Array.isArray(itemProps) && <Form.Item {...itemProps[1]} key={itemProps[1].name} noStyle>
                                <Select
                                  disabled={formDisabled || formReadOnly}
                                  {...scopeData.options[1].props}
                                />
                              </Form.Item>)}
                            />
                          </>
                        </Form.Item>}
                      </div>
                    );
                  //文本数字
                  case 'TextNumber':
                    return (
                      <Fragment key={index}>
                        <Form.Item {...itemProps} key={Array.isArray(itemProps) ? index : itemProps.name}>
                          <div className="content-num">
                            <span className="num-left">{scopeData.props.value[0]}</span>
                            <span className="num-right">{'.' + scopeData.props.value[1]}</span>
                          </div>
                        </Form.Item>
                      </Fragment>
                    );
                  //下选框
                  case 'Select':
                    return (
                      <Fragment key={index}>
                        <Form.Item {...itemProps} key={Array.isArray(itemProps) ? index : itemProps.name}>
                          <Select
                            disabled={formDisabled || formReadOnly}
                            readOnly={formReadOnly}
                            variant={formReadOnly ? 'borderless' : 'outlined'}
                            style={{ height: '40px' }}
                            {...scopeData.props}
                          >
                          </Select>
                        </Form.Item>
                      </Fragment>
                    );
                  //日期选择
                  case 'DatePicker':
                    return (
                      <Fragment key={index}>
                        <Form.Item {...itemProps} key={Array.isArray(itemProps) ? index : itemProps.name}>
                          <DatePicker
                            disabled={formDisabled || formReadOnly}
                            readOnly={formReadOnly}
                            variant={formReadOnly ? 'borderless' : 'outlined'}
                            style={{ width: '100%', height: '40px' }}
                            {...scopeData.props}
                          >
                          </DatePicker>
                        </Form.Item>
                      </Fragment>
                    );
                  //图片块
                  case 'ImgBlock':
                    return (
                      <Fragment key={index}>
                        <Form.Item {...itemProps} key={Array.isArray(itemProps) ? index : itemProps.name}>
                          <div style={{
                            ...scopeData.boxStyle,
                            ...(formDisabled || formReadOnly ? { pointerEvents: 'none', opacity: '0.5' } : {})
                          }}>
                            {scopeData.datas?.map(data => (
                              <div
                                style={{
                                  ...scopeData.itemStyle,
                                  ...(checkPayWayIndex === data.id ? { border: '1px solid #D4A767' } : {})
                                }}
                                onClick={() => scopeData.onClick(data)}
                                key={data.id}
                              >
                                <img
                                  style={data.style}
                                  src={data.imgUrl}
                                  alt=""
                                />
                              </div>
                            ))}
                          </div>
                        </Form.Item>
                      </Fragment>
                    );
                  //单选按钮
                  case 'Radio':
                    return (
                      <Fragment key={index}>
                        <Form.Item {...itemProps} key={Array.isArray(itemProps) ? index : itemProps.name}>
                          <Radio.Group
                            disabled={formDisabled}
                            readOnly={formReadOnly}
                            variant={formReadOnly ? 'borderless' : 'outlined'}
                            {...scopeData.props}
                          >
                          </Radio.Group>
                        </Form.Item>
                      </Fragment>
                    );
                  //多行文本框
                  case 'TextArea':
                    return (
                      <Fragment key={index}>
                        <Form.Item {...itemProps} key={Array.isArray(itemProps) ? index : itemProps.name}>
                          <TextArea
                            disabled={formDisabled}
                            readOnly={formReadOnly}
                            variant={formReadOnly ? 'borderless' : 'outlined'}
                            {...scopeData.props}
                          />
                        </Form.Item>
                      </Fragment>
                    );
                  //上传模块
                  case 'UploadCard':
                    return (
                      // <CertificateUpload type={'ID'}></CertificateUpload>
                      <div className="id-card-upload-main" key={index}>
                        {
                          !formReadOnly && !formDisabled &&
                          (scopeData.options?.map((item, idx) => (
                            <div className="id-card-upload-box" key={idx}>
                              <Upload
                                className="custom-upload"
                                // // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                // listType="picture-card"
                                // fileList={fileListData[idx]}
                                // // onPreview={handlePreview}
                                // onChange={e => handleChange(e, idx)}
                                {...item.props}
                              >
                                {item.props.fileList.length > 0 ? null : (
                                  <div>
                                    <img
                                      style={{ width: '204px', height: '128px', marginTop: '8px' }}
                                      src={item.datas.imgUrl} alt=""
                                    />
                                    <div className="id-card-upload-div">
                                      <CameraOutlined />
                                      <span className="id-card-upload-span">{item.datas.content}</span>
                                    </div>
                                  </div>
                                )}
                              </Upload>
                              {/* {previewImage && (
                              <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                  visible: previewOpen,
                                  onVisibleChange: (visible) => setPreviewOpen(visible),
                                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                              />
                            )} */}
                            </div>
                          )))
                        }
                      </div>
                    );
                  // 上传
                  case 'Upload':
                    return (
                      <Fragment key={index}>
                        {!scopeData.props.hidden && (<Form.Item {...itemProps} key={Array.isArray(itemProps) ? index : itemProps.name}>
                          <Upload
                            readOnly={formReadOnly}
                            {...scopeData.props}
                          >
                          </Upload>
                        </Form.Item>)}
                      </Fragment>

                    )
                  //按钮
                  case 'Button':
                    return (
                      <Fragment key={index}>
                        <Form.Item {...itemProps} key={Array.isArray(itemProps) ? index : itemProps.name}>
                          {
                            !formDisabled && !formReadOnly && (
                              <Button
                                disabled={formDisabled}
                                {...scopeData.props}
                              >
                                {scopeData.content}
                              </Button>)
                          }
                        </Form.Item>
                      </Fragment>

                    );
                  //多个按钮
                  case 'MultipleButtons':
                    return (
                      <div className="multiple-buttons-div" key={index}>
                        {
                          !formDisabled && !formReadOnly && (
                            scopeData.options?.map((option, idx) => (
                              <div className="multiple-buttons" key={`${index}-${idx}`}>
                                {Array.isArray(itemProps) && (<Form.Item {...itemProps[idx]} key={itemProps[idx].name}>
                                  <Button
                                    disabled={formDisabled}
                                    {...{
                                      ...option.props,
                                      type: option.props?.type || "default", // Ensure type defaults to "default"
                                    }}
                                  >
                                    {option.content}
                                  </Button>
                                </Form.Item>)}
                              </div>
                            ))
                          )
                        }
                      </div>
                    );

                  default:
                    return null;
                }
              })()

            ))
          }
        </Form>
      </Spin>

    </div>
  );
};



export default addRouterApi(DetailsForm);