/*
 * @Author: your name
 * @Date: 2021-08-23 19:51:05
 * @LastEditTime: 2021-08-26 18:17:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/@/src/common/components/Form/index.js
 */
import './index.scss';

import {DownOutlined, UpOutlined} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  Transfer,
  DatePicker,
} from 'antd';
import LazySelect from '@/components/LazySelect';
import MultipleSelectInput from '@/components/MultipleSelectInput';
import Cascader from '@/components/Cascader';
import {CheckDataType} from '@/utils';
import {useTranslation} from 'react-i18next';
import React, {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
const {RangePicker} = DatePicker;
const {Password, TextArea} = Input;
const ItemChild = (props) => {
  let {
    type = '',
    props: formProps = {},
    component,
    render,
    onChange: $onChange = () => {},
    value,
    itemProps = {},
  } = props;
  type = type ? type.toLowerCase() : type;
  const onChange = (...ags) => {
    $onChange(...ags);
    if (itemProps.onChange && CheckDataType.isFunction(itemProps.onChange)) {
      itemProps.onChange(...ags);
    }
  };
  const {readOnly, disabled} = formProps;

  let valueKey = formProps.valueKey || 'value';
  let labelKey = formProps.labelKey || 'label';

  const mapTpye = {
    text: <>{value}</>,
    datepicker: (
      <DatePicker
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      />
    ),

    textarea: (
      <TextArea
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
        rows={4}
      />
    ),
    input: (
      <Input
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></Input>
    ),
    inputnumber: (
      <InputNumber
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></InputNumber>
    ),
    radio: (
      <Radio
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></Radio>
    ),
    radiogroup: (
      <Radio.Group
        allowClear
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
        {...formProps}></Radio.Group>
    ),
    rate: (
      <Rate
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></Rate>
    ),

    multipleselectinput: (
      <MultipleSelectInput
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></MultipleSelectInput>
    ),
    select: (
      <Select
        allowClear
        {...formProps}
        showSearch
        filterOption={(input, option) => {
          return (
            option?.label?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0 ||
            option?.[labelKey]
              ?.toString()
              ?.toLowerCase()
              .indexOf(input?.toLowerCase()) >= 0 ||
            option?.[valueKey]?.toString()?.indexOf(input?.toLowerCase()) >= 0
          );
        }}
        disabled={readOnly || disabled}
        value={value}
        options={(formProps.options || []).map((item) => {
          return {
            ...item,
            label: item[labelKey] || item.label,
            value: item[valueKey] || item.value,
          };
        })}
        onChange={onChange}></Select>
    ),

    switch: (
      <Switch
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></Switch>
    ),
    slider: (
      <Slider
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></Slider>
    ),
    timepicker: (
      <TimePicker
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></TimePicker>
    ),
    transfer: (
      <Transfer
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></Transfer>
    ),
    checkbox: (
      <Checkbox
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></Checkbox>
    ),
    password: (
      <Password
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></Password>
    ),

    rangepicker: (
      <RangePicker
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
        }}></RangePicker>
    ),

    lazyselect: (
      <LazySelect
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></LazySelect>
    ),

    cascader: (
      <Cascader
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}></Cascader>
    ),
  };

  return render
    ? render({
        ...props,
        render: undefined,
      })
    : component
    ? component
    : type in mapTpye
    ? mapTpye[type]
    : null;
};

const BaseForm = (props) => {
  let {
    fields = [],
    formProps = {},
    onReady = () => {},
    children = [],
    onConfirm = () => {},
    // onReset = () => {},
    initialValues = {},
  } = props;

  const {t} = useTranslation();

  fields = fields.filter((item) => {
    return !item.exclude;
  });

  const [form] = Form.useForm();
  const [formInitialValues, setFormInitialValues] = useState({});

  const transformInitialValues = useCallback(async (initialValues) => {
    if (CheckDataType.isFunction(initialValues)) {
      return initialValues(form);
    }
    if (CheckDataType.isPromise(initialValues)) {
      return await initialValues(form);
    }

    return initialValues;
  }, []);
  const getInitialValues = useCallback(async () => {
    const vavlues = await transformInitialValues(initialValues);
    setFormInitialValues(vavlues);
  }, []);

  useEffect(() => {
    getInitialValues();
  }, []);

  // initialValues
  const onFinish = (values) => {
    onConfirm(values);
  };

  const onFinishFailed = (errorInfo) => {};
  useEffect(() => {
    onReady(form);
  }, [form]);

  return (
    <div className="base-form">
      <Form
        key={JSON.stringify(formInitialValues)}
        form={form}
        // name="basic"
        layout="vertical"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 12,
        }}
        initialValues={formInitialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        {...formProps}>
        {fields.map((item, index) => {
          const {
            type,
            title,
            items = [],
            render,
            itemProps = {},
            label,
            name,
            props = {},
            options = [],
            rules,
          } = item;

          console.log('item==', item);

          return type !== 'section' ? (
            <Form.Item
              rules={rules}
              label={label}
              name={name}
              key={index}
              // labelCol={{
              //   span: 4,
              // }}
              // wrapperCol={{
              //   span: 100,
              // }}
              {...itemProps}

              // extra='添加或者修改邮箱需要验证邮箱'
            >
              <ItemChild
                type={type}
                props={props}
                options={options}
                render={render}
                itemProps={itemProps}></ItemChild>
            </Form.Item>
          ) : (
            <div className="section" key={index}>
              <div className="title">{title}</div>
              {items
                .filter((item) => {
                  return !item.exclude;
                })
                .map(($item, index) => {
                  const {
                    render,
                    itemProps = {},
                    label,
                    name,
                    options = [],
                    props = {},
                    type,
                    rules,
                  } = $item;

                  return (
                    <Form.Item
                      label={label}
                      name={name}
                      rules={rules}
                      {...itemProps}
                      key={index}>
                      <ItemChild
                        type={type}
                        props={props}
                        options={options}
                        render={render}
                        itemProps={itemProps}></ItemChild>
                    </Form.Item>
                  );
                })}
            </div>
          );
        })}

        {/* 子节点 */}
        {Children.map(
          CheckDataType.isFunction(children) ? children() : children,
          (child) => {
            return cloneElement(child, props);
          }
        )}
      </Form>
    </div>
  );
};

const SearchForm = (props) => {
  const {t} = useTranslation();
  let {
    fields = [],
    formProps = {},
    onReady = () => {},
    children = [],
    shrinkLength,
    onConfirm = () => {},
    onReset = () => {},
    initialValues = {},
  } = props;

  fields = fields.filter((item) => {
    return !item.exclude;
  });

  const [form] = Form.useForm();

  const [formInitialValues, setFormInitialValues] = useState({});

  const transformInitialValues = useCallback(async (initialValues) => {
    if (CheckDataType.isFunction(initialValues)) {
      return initialValues(form);
    }
    if (CheckDataType.isPromise(initialValues)) {
      return await initialValues(form);
    }

    return initialValues;
  }, []);
  const getInitialValues = useCallback(async () => {
    const values = await transformInitialValues(initialValues);
    setFormInitialValues(values);
  }, []);

  useEffect(() => {
    getInitialValues();
  }, []);

  const [expand, setExpand] = useState(false);

  const onFinish = (values) => {
    onConfirm(values);
  };

  const onFinishFailed = (errorInfo) => {};

  const onFill = () => {
    const values = form.getFieldsValue();
    const restValues = Object.keys(values).reduce((acc, item) => {
      const field = fields.find((field) => field.name === item) || {};
      const {itemProps: {initialValue} = {}} = field;
      return {
        ...acc,
        [item]: initialValue !== undefined ? initialValue : undefined,
      };
    }, {});

    form.setFieldsValue(restValues);
    onReset(restValues);
  };

  useEffect(() => {
    onReady(form);
  }, []);

  const renderFields = useCallback(() => {
    let length = shrinkLength
      ? expand
        ? fields.length
        : shrinkLength > fields.length
        ? fields.length
        : shrinkLength
      : fields.length;

    let fieldsVonde = [];
    for (let index = 0; index < length; index++) {
      const item = fields[index];
      const {
        span = 1,
        label,
        name,
        itemProps = {},
        render,
        type,
        props,
        options,
        rules,
      } = item;
      fieldsVonde.push(
        <div key={index} className={`span span-${span}`}>
          <Form.Item rules={rules} label={label} name={name} {...itemProps}>
            <ItemChild
              type={type}
              props={props}
              options={options}
              render={render}
              itemProps={itemProps}></ItemChild>
          </Form.Item>
        </div>
      );
    }
    return fieldsVonde;
  }, [expand, fields]);

  return (
    <div className="search-base-form-box">
      <Form
        key={JSON.stringify(formInitialValues)}
        className="search-base-form"
        form={form}
        name="basic"
        labelCol={{
          span: 7,
        }}
        // wrapperCol={{
        //   span: 20,
        // }}
        initialValues={formInitialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        {...formProps}>
        {renderFields()}
        <div className={`buttons`}>
          {shrinkLength >= fields.length || !shrinkLength ? null : (
            <a
              style={{fontSize: 12, color: '#d4a767'}}
              onClick={() => {
                setExpand(!expand);
              }}>
              {expand ? (
                <>
                  <UpOutlined />
                  {t('Components.Form.Close')}
                  {/* 收起 */}
                </>
              ) : (
                <>
                  <DownOutlined />
                  {t('Components.Form.Expand')}
                  {/* 展开 */}
                </>
              )}
            </a>
          )}
          <Button type="primary" htmlType="submit">
            {t('Components.Form.Search')}
            {/* 搜索 */}
          </Button>
          <Button htmlType="button" onClick={onFill}>
            {t('Components.Form.Reset')}
            {/* 重置 */}
          </Button>
        </div>

        {/* 子节点 */}
        {Children.map(
          CheckDataType.isFunction(children) ? children() : children,
          (child) => {
            return cloneElement(child, props);
          }
        )}
      </Form>
    </div>
  );
};
// BaseForm.SearchForm=SearchForm
export default BaseForm;
export {SearchForm};
