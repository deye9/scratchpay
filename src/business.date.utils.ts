import * as moment from 'moment';
import * as business from 'moment-business';
import * as countries from 'i18n-iso-countries';

// tslint:disable-next-line: no-var-requires
const Holidays = require('date-holidays');

export class BusinessDateUtils {
  /**
   * @description Gets the business date by adding days to the provided by skipping weekends and holidays
   * @author Arsene Tochemey Gandote<tochemey26@gmail.com>
   * @date 2019-05-30
   * @static
   * @param {Date} date The javascript date object
   * @param {number} delay The number of days before settlement
   * @param {string} countryIso2Code The country ISO2 code. This helps to get specific country holidays
   * @returns {*}
   * @memberof BusinessDateUtils
   */
  public static getBusinessDate(
    date: Date,
    delay: number,
    countryIso2Code: string,
  ): any {
    const DATE_FORMAT = 'YYYY-MM-DD';

    const iso2Code: string = countryIso2Code.toUpperCase();

    const dateTostring =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    const initialDate = moment.utc(dateTostring, DATE_FORMAT);

    // Here we make sure that the delay must be a positive number otherwise we return
    // the date sent as the the settlement date
    if (delay < 1) {
      return {
        ok: true,
        initialQuery: {
          initialDate: date,
          delay,
        },
        results: {
          businessDate: initialDate.format('dddd, MMMM Do YYYY'),
          totalDays: 0,
          weekendDays: 0,
          holidays: 0,
        },
      };
    }

    // Here we check the iso2code to make sure we are using the right holidays based upon country code
    if (countries.isValid(iso2Code)) {
      const holidays = new Holidays(iso2Code);
      let addedDays: number = 0;
      let actualDate: moment.Moment = moment.utc(dateTostring, DATE_FORMAT);
      let totalHolidays: number = 0;

      // adds days one by one, skipping weekends and holidays, for positive values of delays
      while (addedDays < delay) {
        actualDate = actualDate.add(1, 'd');
        if (
          !(
            business.isWeekendDay(actualDate) ||
            holidays.isHoliday(actualDate.toDate())
          )
        ) {
          addedDays += 1;
        }
      }

      const totalWeekendDays: number = business.weekendDays(
        initialDate,
        actualDate,
      );
      const totalDaysElapsed: number = actualDate.diff(initialDate, 'd') + 1;
      const actualDateFormatted: string = actualDate.format(
        'dddd, MMMM Do YYYY',
      );

      // Let us poorly get the number of holidays by iterating through the numbers of days between
      // the initial date and the actual settlement date.
      for (let index = 1; index < totalDaysElapsed; index++) {
        const dateToBeTested = moment
          .utc(dateTostring, DATE_FORMAT)
          .add(index, 'd');
        if (holidays.isHoliday(dateToBeTested.toDate())) {
          totalHolidays += 1;
        }
      }

      return {
        ok: true,
        initialQuery: {
          initialDate: date,
          delay,
        },
        results: {
          businessDate: actualDateFormatted,
          totalDays: totalDaysElapsed,
          weekendDays: totalWeekendDays,
          holidays: totalHolidays,
        },
      };
    }

    return {
      ok: false,
      initialQuery: {
        initialDate: date,
        delay,
      },
      results: {
        businessDate: '',
        totalDays: 0,
        weekendDays: 0,
        holidays: 0,
      },
    };
  }

  /**
   * @description Checks whether a given javascript date is a business date or not.
   * True when it is a business date and false on the contrary
   * @author Arsene Tochemey Gandote<tochemey26@gmail.com>
   * @date 2019-05-31
   * @static
   * @param {Date} date The javascript date object
   * @param {string} countryIso2Code he country ISO2 code. This helps to get specific country holidays
   * @returns {boolean} true or false
   * @memberof BusinessDateUtils
   */
  public static isBusinessDate(date: Date, countryIso2Code: string): boolean {
    const DATE_FORMAT = 'YYYY-MM-DD';
    const dateTostring =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    const actualDate = moment.utc(dateTostring, DATE_FORMAT);
    const iso2Code: string = countryIso2Code.toUpperCase();

    if (!countries.isValid(iso2Code)) {
      return false;
    }

    const holidays = new Holidays(iso2Code);
    return !(
      business.isWeekendDay(actualDate) ||
      holidays.isHoliday(actualDate.toDate())
    );
  }
}
