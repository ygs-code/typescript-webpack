
import { useEffect, useState } from 'react';
import { withTranslation, WithTranslation, useTranslation } from 'react-i18next';
import { Input, Select, Mentions } from 'antd';
import { getToken, GetRegionCode } from "@/apis";
import   './index.scss';




const emailOps = [
    { value: 'qq.com', label: 'qq.com' },
    { value: 'gmail.com', label: 'gmail.com' },
    { value: 'outlook.com', label: 'outlook.com' },
    { value: '163.com', label: '163.com' },
    { value: 'hotmail.com', label: 'hotmail.com' },
    { value: 'yahoo.com', label: 'yahoo.com' },
    { value: 'yahoo.com.hk', label: 'yahoo.com.hk' },
    { value: 'icloud.com', label: 'icloud.com' },
    { value: 'sina.com', label: 'sina.com' },
    { value: 'foxmail.com', label: 'foxmail.com' }
]

 

interface IndexProps {
    type: string;
    value: {
        email?: string;
        phone?: string;
        region?: Region;
    };
    onChange?: (value: Object) => void;
    disabled?: boolean;
}
// 城市地区
interface Region {
    value: string;
    label: string;
    callingCodes?: any;
    commonName?: any;
}

export default function Index(props: IndexProps) {
    const {
        type,
        value: {
            email,
            phone,
            region
        } = {},
        onChange = () => { },
        disabled,
        readOnly,
    } = props

    const { t } = useTranslation()

    const [regions, setRegions] = useState<Region[]>([])
    // 初始化code
    useEffect(() => {
        GetRegionCode().then(({ data }) => {

            setRegions(
                // [{
                //     value: '', // Add a default value
                //     label: t('registerForm_region')
                // }].concat(
                data.map((item: { nativeName: string; alpha2Code: string; commonName: string; callingCodes: string }) => {
                    const {
                        alpha2Code,
                        callingCodes = '',
                        commonName,
                        nativeName,
                    } = item
                    return {
                        ...item,
                        value: alpha2Code,
                        label: `${callingCodes} ${commonName}`,

                    }
                }))
            // )
        })
    }, [])


    return <div className='email-phone'>
        {
            type == 'email' ?
                <Mentions
                    style={{ width: '100%' }}
                    className=' mentions-box h-10 '
                    split={''}
                    value={email}
                    options={emailOps}
                    rows={1}
                    disabled={disabled}
                    readOnly={readOnly}
                    onChange={(v: string) => {
                        onChange({
                            email: v
                        })
                    }}
                /> :
                <div className='flex'>
                    <div className='w-120 relative select-region'>
                        <Select
                            disabled={readOnly}
                            readOnly={readOnly}
                            value={region?.value}
                            optionFilterProp="label"
                            placeholder={t('Pages.login.registerForm_region')}
                            style={{ width: 120 }}
                            showSearch
                            popupMatchSelectWidth={true}
                            dropdownStyle={{ width: 320 }}
                            onChange={(v: string) => {
                                let region = regions.find(item => {
                                    return item.value == v
                                })
                                onChange({
                                    region,
                                    phone
                                })
                            }}
                            options={
                                regions
                            }
                        />
                    </div>
                    <div
                        className=' input-box'
                    >
                        <Input
                            disabled={disabled}
                            readOnly={readOnly}
                            value={phone}
                            className=' rounded-bl-none rounded-tl-none'
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const { value: v } = event.target;
                                onChange({
                                    region,
                                    phone: v
                                })
                            }}
                        />

                    </div>

                </div>

        }
    </div>



}