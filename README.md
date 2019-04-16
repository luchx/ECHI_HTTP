# requestValidator
> 用于拦截axios请求,并对请求参数进行校验,防止提交非法值

由于本人一直在用Typescript作开发,所以提交的文件后缀名是.ts结尾的,你也可以自行修改后缀名,并将里面的类型声明去除即可;

### 文件说明
```bash 
root：
 |--validator # 校验方法
 |--axios # axios封装请求//拦截配置
 |    |--config.ts # axios拦截器配置文件
 |    |--service,ts # axios请求配置文件

 ```

一直以来,我们在提交请求时经常会遇到这样的情况,就是提交的参数与后台所需不一致;
这样一来,无疑就浪费了一次请求;特别的实在网络比较慢的情况下,返回需要的时间过长,这样对用户来说体验很不好

### 使用

#### API 请求

```js
    // api
    import service from 'path/service';
    import {
        validate
    } from 'path/validator';

    async function anyRequest(params) {
        return service.get({
            `path/${params}`
        }, {
            fileds: {
                params
            },
            rules: {
                params: [validate.isRequired],
            }
        });
    }

```

#### 校验方法及参数设置

```js
    // validator
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

```

#### 封装axios请求

```js
    // service
    import axios from './config';
    import requestValidator from '../validator';

    // HTTP工具类
    export default class Http {
    public static async request(params: any, descriptor ?: any) {
        // 添加请求拦截校验
        if (descriptor !== undefined) {
            let fileds = descriptor.fileds || {};
            let rules = descriptor.rules || {};
            await requestValidator(fileds, rules);
        }
        return await axios(params);
    }

    /**
     * get
     * @param [url] 地址
     * @param [data] 数据
     * @returns Promise
     */
    public static get(req: any, descriptor ?: any): any {
        return this.request({
            method: 'GET',
            url: `/${req.url}`,
            params: req.data,
        }, descriptor);
    }

    /**
     * put
     * @param [url] 地址
     * @param [data] 数据
     * @returns Promise
     */
    public static put(req: any, descriptor ?: any): any {
        return this.request({
            method: 'PUT',
            url: `/${req.url}`,
            data: req.data,
        }, descriptor);
    }

    /**
     * post
     * @param [url] 地址
     * @param [data] 数据
     * @returns Promise
     */
    public static post(req: any, descriptor ?: any): any {
        return this.request({
            method: 'post',
            url: `/${req.url}`,
            data: req.data,
        }, descriptor);
    }

    /**
     * delete
     * @param [url] 地址
     * @param [data] 数据
     * @returns Promise
     */
    public static delete(req: any, descriptor ?: any): any {
        return this.request({
            method: 'DELETE',
            url: `/${req.url}`,
            params: req.data,
            }, descriptor);
        }
    }

```
