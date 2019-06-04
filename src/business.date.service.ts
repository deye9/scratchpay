import { Injectable } from '@nestjs/common';
import { BusinessDateUtils } from './business.date.utils';

@Injectable()
export class BusinessDateService {
  /**
   * @description Gets business date by wrapping around the utils method.
   * @author Arsene Tochemey Gandote<tochemey26@gmail.com>
   * @date 2019-05-30
   * @param {Date} date The javascript date object
   * @param {number} delay The number of days before settlement
   * @param {string} country The country ISO2 code
   * @returns {*}
   * @memberof BusinessDateService
   */
  getDate(date: Date, delay: number, country: string): any {
    return BusinessDateUtils.getBusinessDate(date, delay, country);
  }

  /**
   * @description Checks whether a given date is a working day.
   * It checks against holidays and weekend days.
   * @author Arsene Tochemey Gandote<tochemey26@gmail.com>
   * @date 2019-05-31
   * @param {Date} date The javascript date object
   * @param {string} country The country ISO2 code
   * @returns {boolean}
   * @memberof BusinessDateService
   */
  isBusinessDate(date: Date, country: string): boolean {
    return BusinessDateUtils.isBusinessDate(date, country);
  }
}
