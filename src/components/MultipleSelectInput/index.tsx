import './index.scss';

import { DownOutlined, UpOutlined } from '@ant-design/icons';
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
    TreeSelect
} from 'antd';

import type { SelectProps, InputProps } from 'antd';

import React, { PureComponent, useEffect } from 'react';



export default (props: {
    options?: any[],
    value?: any,
    onChange?: (v: Object) => void,
    selectProps?: SelectProps,
    inputProps?: InputProps,
}) => {
    const {
        options = [],
        value = {},
        onChange,
        selectProps = {},
        inputProps = {},
    } = props

    const sharedProps: SelectProps = {
        mode: 'multiple',
        style: { width: '100%' },
        options,
        // maxTagCount: 'responsive',
    };


    const { selectValue = ['all'], inputValue } = value





    const treeData = [
        {
            title: '全部',
            value: 'all',
            key: 'all',
            children: [
                ...options.map(item => {
                    const {
                        label,
                        value
                    } = item
                    return {
                        title: label,
                        value: value,
                        key: value,
                    }
                }),
            ],
        },
    ];

    const { SHOW_PARENT } = TreeSelect;

    const tProps = {
        treeData,
        value: selectValue,
        onChange,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: '请选择',
        maxTagCount: 'responsive' as const,
        style: {
            width: '100%',
        },
    };



    useEffect(() => {

        onChange({
            selectValue: options.map(item => item.value),
            inputValue,
        })


    }, [])


    return <div className='multiple-select-input'>


        <TreeSelect            
            dropdownStyle={{ 
                maxHeight: 400, 
                width: 300,               
                overflow: 'auto'
             }}
            treeDefaultExpandAll
            {...tProps}
            style={{
                 width: '200px',
                marginRight: '4px'
            }}
            value={(() => {
                if (selectValue.length === options.length) {
                    return ['all']
                } else {
                    return selectValue
                }
            })()}
            onChange={(v) => {
                if (v.includes('all')) {
                    onChange && onChange({
                        selectValue: options.map(item => item.value),
                        inputValue,
                    })
                } else {
                    onChange && onChange({
                        selectValue: v,
                        inputValue,
                    })
                }


            }}
        />
        <Input
            value={inputValue}
            allowClear
            {...inputProps}
            style={{
                marginLeft: '4px'
            }}
            onChange={({
                target: {
                    value: v
                } = {}
            }) => {



                let $selectValue = selectValue.includes('all') ? options.map(item => item.value) : selectValue
                onChange && onChange({
                    selectValue: $selectValue,
                    inputValue: v
                })
            }}
        />
    </div>
}