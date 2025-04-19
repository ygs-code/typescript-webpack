// useCounter.js
import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { v4 as uuidv4 } from 'uuid';

interface PropsType {
    initialValue: number;
    request: Function
    requestParame?: Object;
    onChange?: Function
    value?: valueType[]
    beforeUpload?: Function
    verifyInfo?: Object;
    isCropper?: Boolean;
    accept?: String;
    isAlertErrorMsg?: Boolean;
}

interface SizeMap {
    [key: string]: (fileSize: number) => number;
}

interface SizeNumUnit {
    unit: string;
    sizeNum: string;
}

interface UseUploadReturn {
    onChangeFile: Function
    startUpload: Function
    fileUpload: Function
    isImg: Function
    getFileReader: Function
    verify: Function
    getFormParameter: Function
    imgRes: any
}

interface valueType {
    uuid: string;
    status: string;
    url?: string;
    name: string;
    type: string;
}


export default (props: PropsType): UseUploadReturn => {
    const {
        request = async () => { },
        requestParame = {}, // 请求参数
        onChange = (data: any) => { },
        value = [],
        beforeUpload = async (file: File) => file,
        verifyInfo = {}, // 验证信息
        isCropper, // 是否需要截图 文件类型上传的时候该参数无效
        accept = 'image/*', // = 'image/*'
        isAlertErrorMsg = true,
    } = props

    // // 开始上传
    const startUpload = async (file: File, value: valueType[], uuid: string) => {
        const formParameter = getFormParameter({ file, ...requestParame })
        await fileUpload(formParameter, value, uuid)
    }


    // // 文件上传
    const fileUpload = async (formData: FormData, value: valueType[], uuid: string) => {
        if (!request) {
            throw '请在props传入request'
        }
        // 上传
        return await request(formData)
            .then(({ data }: { data?: { sasUrl: string } } = {}) => {
                const {
                    sasUrl
                } = data || {}
                value = value.map(item => {
                    if (uuid == item.uuid) {
                        item = {
                            ...item,
                            ...data,
                            status: 'done',
                            url: sasUrl
                        }
                    }
                    

                    return item

                })
                onChange([...value])
            })
            .catch(() => {
                value = value.map(item => {
                    if (uuid == item.uuid) {
                        item.status = 'error'
                    }
                    return item

                })
                onChange([...value])
            })
    }

    // // input 改变图片
    const onChangeFile = async (file: File) => {
        const { name, type } = file


        await beforeUpload(file)
        // this.setState({
        //   isUpload: true,
        // })
        //   const fileReaderData = await getFileReader(file)

        await verify(verifyInfo, file).catch((error) => {
            // this.setState({
            //   isUpload: false,
            // })

            throw error
        })

        // if (props.type == 'video') {
        //     this.setState(() => ({
        //         isUpload: true,
        //     }))
        //     this.Resumable.ResumableField.appendFilesFromFileList(files, e)
        //     return
        // }

        const imgFlag = isImg(type)
        let uuid = uuidv4()
        if (imgFlag) {
            const fileReaderData = await getFileReader(file) as { base64: string }
            // this.setState(() => ({
            //     isUpload: true,
            // }))

            // 如果需要截图 先截图在上传
            if (isCropper) {
                // setNowFile(file)
                // setCropperpPreviewImage(fileReaderData.base64)
                // setCropperVisible(true)

                // this.setState(
                //     {
                //         nowFile: file,
                //         cropperpPreviewImage: fileReaderData.base64,
                //         cropperVisible: true,
                //     },
                //     () => {
                //         // this.setState(
                //         //   {
                //         //     // cropperVisible: true,
                //         //   },
                //         //   () => {}
                //         // )
                //     }
                // )
                return false
            }





            value.unshift({
                uuid,
                name,
                type,
                url: fileReaderData.base64,
                status: 'uploading',
            })


            onChange([...value])
        } else {
            // value.unshift({
            //     name,
            //     type,
            //     url: '',
            //     isUpload: true,
            // })

            // onChange([...value])
        }
        // 开始上传
        await startUpload(file, value, uuid)
    }


    const isImg = (type: string) => {
        const reg = /^image/gi
        return reg.test(type)
    }



    // // 图片预览加载
    const getFileReader = async (file: File) => {
        return await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file) //发起异步请求
            reader.onload = (evt) => {
                //读取完成后，数据保存在对象的result属性中
                resolve({
                    base64: evt.target?.result || '',
                })
            }
            // 发生错误
            reader.onerror = (evt) => {
                reject({
                    errorMessage: '文件读取错误',
                })
            }
            reader.onloadstart = (evt) => { }
            reader.onprogress = (evt) => { }
        })
    }





    const getSizeNumUnit = (size: string, sizeMap: SizeMap): SizeNumUnit => {
        let unit = '';
        let regNum = /\d+(\.\d+)?/gi;
        let sizeNum: string | null = '0';

        const matchResult = size.match(regNum);
        sizeNum = matchResult ? matchResult[0] : '0';

        for (let key in sizeMap) {
            if (sizeMap.hasOwnProperty(key)) {
                unit = size.toString().replace(regNum, '');
                unit = unit.toUpperCase();
                if (unit == key) {
                    break;
                }
            }
        }
        unit = unit || 'B';
        return {
            unit,
            sizeNum,
        };
    }

    // // 校验
    const verify = async (verifyInfo: any, file: File) => {
        // const {

        //     accept = 'image/*', // = 'image/*'

        //     customRequest: newCustomRequest, // 可以不传递

        //     isAlertErrorMsg = true,

        // } = props

        const { value = [] } = props

        const { size, miniSize, maxSize, width, height, miniWidth, miniHeight, maxWidth, maxHeight } = verifyInfo
        let { name, type, size: fileSize } = file

        if (accept.search(/\*/g) == -1 && accept.search(type) == -1) {
            isAlertErrorMsg && message.error(`上传的${isImg(type) ? '图片' : '文件'}格式不正确,上传只支持${accept}格式`)
            // onChange({ error: `上传的${isImg(type) ? '图片' : '文件'}格式不正确,上传只支持${accept}格式`, file, value: undefined })
            throw `上传的${isImg(type) ? '图片' : '文件'}格式不正确,上传只支持${accept}格式`
        }

        const sizeMap = {
            B: (fileSize: number) => {
                return fileSize
            },
            KB: (fileSize: number) => {
                return fileSize / Math.pow(1024, 1)
            },
            MB: (fileSize: number) => {
                return fileSize / Math.pow(1024, 2)
            },
            GB: (fileSize: number) => {
                return fileSize / Math.pow(1024, 3)
            },
            TB: (fileSize: number) => {
                return fileSize / Math.pow(1024, 4)
            },
            PB: (fileSize: number) => {
                return fileSize / Math.pow(1024, 5)
            },
            EB: (fileSize: number) => {
                return fileSize / Math.pow(1024, 6)
            },
            ZB: (fileSize: number) => {
                return fileSize / Math.pow(1024, 7)
            },
            YB: (fileSize: number) => {
                return fileSize / Math.pow(1024, 8)
            },
            BB: (fileSize: number) => {
                return fileSize / Math.pow(1024, 9)
            },
        }

        const verifyMap = {
            size: (size: string, imageWidth: number, imageHeight: number) => {
                const { unit, sizeNum } = getSizeNumUnit(size, sizeMap)
                fileSize = sizeMap[unit as keyof typeof sizeMap](Number(fileSize))

                if (new Number(fileSize).toFixed(2) != new Number(sizeNum).toFixed(2)) {
                    isAlertErrorMsg &&
                        message.error(
                            `上传的${isImg(type) ? '图片' : '文件'}size限制为${new Number(sizeNum).toFixed(2)}${unit},当前上传的${isImg(type) ? '图片' : '文件'
                            }size为${new Number(fileSize).toFixed(2)}${unit}`
                        )

                    throw `上传的${isImg(type) ? '图片' : '文件'}size限制为${new Number(sizeNum).toFixed(2)}${unit},当前上传的${isImg(type) ? '图片' : '文件'
                    }size为${new Number(fileSize).toFixed(2)}${unit}`
                }
            },
            miniSize: (miniSize: string, imageWidth: number, imageHeight: number) => {
                const { unit, sizeNum } = getSizeNumUnit(miniSize, sizeMap)
                fileSize = sizeMap[unit](fileSize)
                if (new Number(fileSize).toFixed(2) < new Number(sizeNum).toFixed(2)) {
                    isAlertErrorMsg &&
                        message.error(
                            `上传的${isImg(type) ? '图片' : '文件'}size不能小于${new Number(sizeNum).toFixed(2)}${unit},当前上传的${isImg(type) ? '图片' : '文件'
                            }size为${new Number(fileSize).toFixed(2)}${unit}`
                        )

                    throw `上传的${isImg(type) ? '图片' : '文件'}size不能小于${new Number(sizeNum).toFixed(2)}${unit},当前上传的${isImg(type) ? '图片' : '文件'
                    }size为${new Number(fileSize).toFixed(2)}${unit}`
                }
            },
            maxSize: (maxSize: number, imageWidth: number, imageHeight: number) => {
                const { unit, sizeNum } = getSizeNumUnit(maxSize, sizeMap)
                fileSize = sizeMap[unit](fileSize)

                if (new Number(new Number(fileSize).toFixed(2)) > new Number(new Number(sizeNum).toFixed(2))) {
                    isAlertErrorMsg &&
                        message.error(
                            `上传的${isImg(type) ? '图片' : '文件'}size不能大于${new Number(sizeNum).toFixed(2)}${unit},当前上传的${isImg(type) ? '图片' : '文件'
                            }size为${new Number(fileSize).toFixed(2)}${unit}`
                        )

                    throw `上传的${isImg(type) ? '图片' : '文件'}size不能大于${new Number(sizeNum).toFixed(2)}${unit},当前上传的${isImg(type) ? '图片' : '文件'
                    }size为${new Number(fileSize).toFixed(2)}${unit}`
                }
            },
            widthHeightRatio: (ratio: number, imageWidth: number, imageHeight: number) => {
                const ratioFn = new Function(`return  ${ratio}`)
                if (new Number(imageWidth) / new Number(imageHeight) != ratioFn()) {
                    isAlertErrorMsg && message.error(`上传图片宽高比例不正确应为${ratio}，请从新上传.`)

                    throw `上传图片宽高比例不正确应为${ratio}，请从新上传.`
                }
            },
            width: (width: number, imageWidth: number, imageHeight: number) => {
                if (width != imageWidth) {
                    isAlertErrorMsg &&
                        message.error(`上传的图片限制宽度为${width}px,当前上传的${isImg(type) ? '图片' : '文件'}宽度为${imageWidth}px`)

                    throw `上传的图片限制宽度为${width}px,当前上传的${isImg(type) ? '图片' : '文件'}宽度为${imageWidth}px`
                }
            },
            height: (height: number, imageWidth: number, imageHeight: number) => {
                if (height != imageHeight) {
                    isAlertErrorMsg &&
                        message.error(`上传的图片限制高度为${height}px,当前上传的${isImg(type) ? '图片' : '文件'}高度为${imageHeight}px`)

                    throw `上传的图片限制高度为${height}px,当前上传的${isImg(type) ? '图片' : '文件'}高度为${imageHeight}px`
                }
            },
            miniWidth: (miniWidth: number, imageWidth: number, imageHeight: number) => {
                if (miniWidth > imageWidth) {
                    isAlertErrorMsg && message.error(`上传的图片小于最小宽度${miniWidth}px`)

                    throw `上传的图片小于最小宽度${miniWidth}px`
                }
            },
            miniHeight: (miniHeight: number, imageWidth: number, imageHeight: number) => {
                if (miniHeight > imageHeight) {
                    isAlertErrorMsg && message.error(`上传的图片小于最小高度${miniWidth}px`)
                    // onChange({
                    //   error: `上传的图片小于最小高度${miniWidth}px`,
                    //   file,
                    // })
                    throw `上传的图片小于最小高度${miniWidth}px`
                }
            },
            maxWidth: (maxWidth: number, imageWidth: number, imageHeight: number) => {
                if (maxWidth < imageWidth) {
                    isAlertErrorMsg && message.error(`上传的图片大于最大宽度${miniWidth}px`)

                    throw `上传的图片大于最大宽度${miniWidth}px`
                }
            },
            maxHeight: (maxHeight: number, imageWidth: number, imageHeight: number) => {
                if (maxHeight < imageHeight) {
                    isAlertErrorMsg && message.error(`上传的图片大于最大高度${maxHeight}px`)

                    throw `上传的图片大于最大高度${maxHeight}px`
                }
            },
        }

        if (isImg(type)) {
            const fileReaderData = await getFileReader(file)
            const image = new Image()
            image.src = fileReaderData.base64
            const { imageWidth, imageHeight } = await new Promise((resolve, reject) => {
                image.onload = () => {
                    resolve({
                        imageWidth: image.height,
                        imageHeight: image.width,
                    })
                }
            })

            for (let key in verifyInfo) {
                if (verifyInfo.hasOwnProperty(key)) {
                    verifyMap[key](
                        key == 'size' || key == 'miniSize' || key == 'maxSize' || key == 'widthHeightRatio'
                            ? verifyInfo[key]
                            : parseInt(verifyInfo[key]),
                        imageWidth,
                        imageHeight
                    )
                }
            }
        } else {
            for (let key in verifyInfo) {
                if (verifyInfo.hasOwnProperty(key) && (key == 'size' || key == 'miniSize' || key == 'maxSize')) {
                    verifyMap[key](verifyInfo[key])
                }
            }
        }
    }
    // // 表单
    const getFormParameter = (data) => {
        const formData = new FormData()
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key])
            }
        }
        return formData
    }










    const { initialValue } = props;
    const [count, setCount] = useState<number>(initialValue);

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(initialValue);

    return {
        onChangeFile,
        startUpload,
        fileUpload,
        isImg,
        getFileReader,
        verify,
        getFormParameter,
    };
}

