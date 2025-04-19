/*
 * @Author: your name
 * @Date: 2021-08-23 19:51:05
 * @LastEditTime: 2021-08-26 17:03:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/@/src/common/components/Form/index.js
 */
import './index.scss';

import { Button, Spin } from 'antd';
import { v4 as uuidv4 } from "uuid"
import Form from '@/components/Form';
import React, { PureComponent } from 'react';


class Index extends PureComponent {
  form = {};
  action = 'add';
  constructor(props) {

    super(props);
    this.state = {
      loading: true,
      sourceData: {},
      reloadId: uuidv4()
    };
  }
  // defaultState = () => {
  //   return {
  //     loading: false
  //   };
  // };

  /**
   * 用于将form的字段值转换为接口需要的格式
   */
  public mapSubmitData = (formData) => {
    return formData;
  };

  /**
   * 用于将从接口获取到的初始化数据，转换成form需要的格式
   * 这个函数需要在getInitData中手动调用，因此函数名不限于mapInitData
   */
  public mapInitData = async (initData) => {


    return initData
  };

  onReload = () => {
    setTimeout(() => {
      this.setState({
        loading: true,
        reloadId: uuidv4()
      })
    }, 100)
  }
  // 验证表单
  onValidaForm = async (parameter = {}) => {
    const { validateFields } = this.form;

    return new Promise(async (resolve, reject) => {
      await validateFields()
        .then(async (values) => {
          this.setState(() => {
            return {
              loading: true,
            };
          });
          resolve(values);
          return await this.onSubmitForm({
            ...parameter,
            ...values,
          }).catch((error) => {
            throw error;
          });


        })
        .catch((error) => {
          reject(error)
          this.setState({
            loading: false,
          });
          console.error('error:', error);
        });
      this.setState({
        loading: false,
      });
    })
  };

  //    提交请求到接口
  onSubmitForm = async (formData) => {
    const data = await this.mapSubmitData(formData);
  };

  // 初始化表单
  getInitialValues = async () => {
    return await this.mapInitData({});
  };
  // 获取字段
  getFields = (): { type: string; title: string; items: any[] }[] => {
    return [];
  };
  // 底部按钮
  getFooter = () => {
    const {
      match: {
        params: { action },
      },
      history = {},
    } = this.props;

    const { loading } = this.state;

    const readOnly = action === 'view';
    return (
      <div className="button-box">
        {!readOnly ? (
          <Button type="primary" loading={loading} onClick={() => {
            this.onValidaForm()
          }}>
            确认
          </Button>
        ) : null}
        <Button
          loading={loading}
          onClick={() => {
            history.back();
          }}>
          返回
        </Button>
      </div>
    );
  };
  renderForm = (props = {}) => {
    const { loading, initLoading, reloadId } = this.state;


    console.log('loading=====', loading)

    return (
      <div className="form-page-component">
        <div className="form-box">
          <Spin tip="加载中..." spinning={loading}>
            <Form
              key={reloadId}
              {...props}
              fields={this.getFields()}
              onReady={this.onFormReady}
              initialValues={async () => {
                const {
                  match: {
                    params: { id } = {},
                  } = {},
                } = this.props;
                this.setState(() => {
                  return {
                    loading: true,
                  };
                });



                let values =
                  id === undefined && this.action == 'add' ? {} : await this.getInitialValues();




                this.setState({
                  sourceData: values,
                  loading: false,
                });

                setTimeout(() => {
                  this.forceUpdate();
                }, 50);

                return values;
              }}></Form>
          </Spin>
        </div>
        {this.getFooter() ? (
          <div className="footer">{this.getFooter()}</div>
        ) : null}
      </div>
    );
  };
  onFormReady = (form) => {
    this.form = form;
  };

  render() {
    return (
      <div className="form-page-component">
        <div className="form-box">
          <Form fields={this.getFields()} onReady={this.onFormReady}></Form>
        </div>
        {this.getFooter() ? (
          <div className="footer">{this.getFooter()}</div>
        ) : null}
      </div>
    );
  }
}




export default Index


export {
  Index as FormPage
}