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