
export const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i
export const codeReg = /^[a-zA-Z0-9]+$/ig
export const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,16}$/ig






export const getSearchParams = (paramName: string) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const paramValue = params.get(paramName); // 获取参数值
    return paramValue
}







// const string = '\u5f6d\u535a\u5546\u54c1\u6307\u6570'

// const unicodeArray = ['\u5f6d', '\u535a', '\u5546', '\u54c1', '\u6307', '\u6570'];




// const parsedString = unicodeArray.map(
//     (code) => {

//         return String.fromCharCode(
//             parseInt(
//                 code.replace('\\u', ''),
//                 16)
//         )
//     }
// ).join('');



export const codeToChinese = (string: string) => {
    const unicodeArray = string.split('\\u').slice(1);
    return unicodeArray.map(
        (code) => {

            return String.fromCharCode(
                parseInt(
                    code,
                    16)
            )
        }
    ).join('');

}



