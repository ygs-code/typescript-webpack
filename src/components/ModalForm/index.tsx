import "./index.scss";

import { message, Button, Modal } from "antd";
// import {
//   createPermission,
//   editPermission,
//   getPermissionInfo,
//   getPermissionList
// } from "src/assets/js/request";
import FormPage from "src/components/FormPage";
import { useEffect, useRef, useState } from "react";
interface Props {
  getInitialValues?: () => Promise<any>;
  onSubmitForm?: () => void;
  getFooter?: (context: any) => React.ReactNode;
  getFields?: (context: any) => React.ReactNode;
  history?: { back: () => void };
  match?: { params: { id?: string; action?: string } };
}




interface InitData {

}
interface SubmitData {

}





class Index extends FormPage {
  // constructor(props: Props) {
  //   super(props);
  //   this.state = {
  //     ...this.state
  //   };
  // }

  /**
   * 用于将从接口获取到的初始化数据，转换成form需要的格式
   * 这个函数需要在getInitData中手动调用，因此函数名不限于mapInitData
   */



  action = "edit";

  // 初始化值
  getInitialValues = async () => {
    const {
      getInitialValues = () => ({})
    } = this.props;

    return await this.mapInitData(await getInitialValues(this));
  };


  // 提交请求到接口
  onSubmitForm = async (formData: InitData): Promise<void> => {
    const {
      onSubmitForm = () => { }
    } = this.props;
    const values: SubmitData = await this.mapSubmitData(formData);


    onSubmitForm(values)

  };


  // 底部按钮
  getFooter = () => {
    const { getFooter = () => { } } = this.props;


    return getFooter(this)

  };

  getFields = () => {
    const {
      getFields = () => { }
    } = this.props;



    return getFields(this)

  };

  componentDidMount() { }
  render() {
    const { formProps = {} } = this.props

    return (
      <div className="form-page modal-form">
        {this.renderForm({
          formProps
        })}
      </div>
    );
  }
}

export default (props) => {
  const {
    open,
    onOk,
    onCancel,
    modalProps = {},
    formProps = {}
  } = props
  const ref = useRef(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {


  }, [open])

  return <Modal
    open={open}
    destroyOnClose
    confirmLoading={confirmLoading}
    maskClosable={false}
    onOk={async () => {

      let values = await ref.current.onValidaForm({})

      setConfirmLoading(true)
      await onOk(values).catch(() => {
        setConfirmLoading(false)
      })
      setConfirmLoading(false)
    }} onCancel={onCancel}
    width={500}
    {...modalProps}>


    <Index
      ref={ref}
      formProps={{
        labelCol: {
          span: 20,
        },
        wrapperCol: {
          span: 50,
        }
      }}
      {...props}
    ></Index>

  </Modal >

}