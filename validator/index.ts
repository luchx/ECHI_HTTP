import AsyncValidator from 'async-validator';

/**
 * 校验请求参数规则
 * @desc 用于表单校验,通过异步校验,当校验出错时会抛出异常
 * @export
 * @param [Object] [fileds={key: value}] 需要校验的字段
 * @param [Object] [rules={key: validator}]  // 校验规则
 * @returns void
 */
export default function requestValidator(fileds = {}, rules = {}) {
    return new Promise((resolve, reject) => {
        const validator = new AsyncValidator(rules);
        validator.validate(fileds, {
            firstFields: true
        }, (errors, data) => {
            const status = !errors ? 'success' : 'error';
            const message = errors ? errors[0].message : '';
            if (status === 'success') {
                resolve({
                    status,
                    message,
                    data
                });
            } else {
                console.warn(`当前参数校验不通过,错误信息: ${message}`);
                reject({
                    status,
                    message,
                    data,
                    isValid: true
                });
            }
        });
    });
}

// 校验规则
// 字段扩展请看 https://github.com/yiminghe/async-validator
export const validate = {
    // 必填项
    isRequired: {
        required: true
    },
    // 字符串校验
    isString: {
        type: 'string'
    },
    // 对象校验
    isObject: {
        type: 'object'
    },
    // 数组校验
    isArray: {
        type: 'array'
    },
    // 数值校验
    isNumber: {
        type: 'number'
    }
};