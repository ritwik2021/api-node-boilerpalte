import { HttpStatus } from '@nestjs/common';
import moment from 'moment';

export function getErrorResponse(message: string) {
  return {
    status: false,
    statuscode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: message
  };
}

export function getNoDataFound(message: string) {
  return {
    status: true,
    statuscode: HttpStatus.NO_CONTENT,
    message: message,
    result: []
  };
}

export function getSuccessResponse(message: string, result: any) {
  return {
    status: true,
    statuscode: HttpStatus.OK,
    message: message,
    result: result
  };
}

export function getUnauthorized(message: string) {
  return {
    status: false,
    statuscode: HttpStatus.UNAUTHORIZED,
    message: message
  };
}

export function userNotExist(message: string) {
  return {
    status: true,
    statuscode: HttpStatus.OK,
    message: message
  };
}

export function removeExponential(x) {
  if (Math.abs(x) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = '0.' + new Array(e).join('0') + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join('0');
    }
  }
  return x;
}

export function getIntervalDate(interval: number) {
  let dateFrom: any = moment()
    .subtract(interval, 'd')
    .format('YYYY-MM-DD'); /* get date of interval (7, 30, 90, 180) date before */
  dateFrom = new Date(dateFrom).toISOString().slice(0, 10);
  return dateFrom;
}

export function getIntervalMonth(interval: number) {
  let dateFrom: any = moment()
    .subtract(interval, 'months')
    .format('YYYY-MM-DD'); /* get date of interval (7, 30, 90, 180) date before */
  dateFrom = new Date(dateFrom).toISOString().slice(0, 10);
  return dateFrom;
}

/**
 *
 * @param interval: string [1m, 3m, 6m, 7d]
 * @returns string
 */
export function getInterval(interval: any) {
  let intervalDate;
  if (interval == '1m') {
    intervalDate = this.getIntervalDate(30); /* pass 30 days */
  } else if (interval == '3m') {
    intervalDate = this.getIntervalDate(90); /* pass 90 days */
  } else if (interval == '6m') {
    intervalDate = this.getIntervalDate(180); /* pass 180 days */
  } else {
    intervalDate = this.getIntervalDate(7); /* pass 7 days */
  }
  intervalDate = new Date(intervalDate).toISOString();
  return intervalDate;
}

export function getDaysBetweenDates(startDate, endDate) {
  const now = startDate.clone();
  const dates = [];

  while (now.isSameOrBefore(endDate)) {
    dates.push(now.format('YYYY-MM-DD'));
    now.add(1, 'days');
  }
  return dates;
}

export function fetchDateFormat(date) {
  return moment(date).format('MMM DD, YYYY');
}

export function findMonthsBetweenDates(startDate, endDate) {
  const dates = [];
  const month = moment(startDate); //clone the startDate
  while (month < endDate) {
    month.add(1, 'month');
    dates.push(month.format('YYYY-MM-DD'));
  }
  return dates;
}

export function subtractWeek(num: number) {
  return moment().subtract(num, 'week').format('YYYY-MM-DD');
}

export function calculatePriceChange(oldvalue, newValue) {
  const changeArrow = Number(newValue) >= Number(oldvalue) ? 'up' : 'down';
  const decreaseValue = Number(oldvalue) - Number(newValue);
  if (!oldvalue) {
    return { percentage: 100, arrow: changeArrow };
  } else {
    const percentage = Math.abs((decreaseValue / Number(oldvalue)) * 100).toFixed(2);
    return { percentage: percentage, arrow: changeArrow };
  }
}

export function prePareEmptyGraphData(arrayData) {
  return arrayData.map((unidate) => {
    return {
      date: unidate,
      formatDate: this.fetchDateFormat(unidate),
      actual: 0,
      final: '$0'
    };
  });
}

export function prePareEmptyGraphDataWithoutSymbol(arrayData) {
  return arrayData.map((unidate) => {
    return {
      date: unidate,
      formatDate: this.fetchDateFormat(unidate),
      actual: 0,
      final: '0'
    };
  });
}

export function prePareEmptyGraphMonthlyData(arrayData) {
  return arrayData.map((unidate) => {
    return {
      month: moment(unidate).format('MMM'),
      formatDate: moment(unidate).format('MMM DD, YYYY'),
      actual: 0,
      final: '$0'
    };
  });
}

export function fetchLastDayTimestamp() {
  return moment().subtract(1, 'day').unix();
}

export function fetchWeekTimeStamp() {
  return moment().subtract(7, 'day').unix();
}

export function subtractDate(num) {
  return moment().subtract(num, 'day').format('YYYY-MM-DD');
}

export function timeBefore24h(num) {
  return moment().subtract(num, 'day').format('YYYY-MM-DD HH:mm:ss');
}

export function fetchMonthBeforeTimestamp(month) {
  return moment().subtract(month, 'month').unix();
}

export function convertBnb(val: string) {
  return val && (val.toLowerCase() == 'wbnb' || val.toLowerCase() == 'wrapped bnb') ? 'BNB' : val;
}
/**
 *
 * @param arrayData: array of objects
 * @returns uniqueDates: array
 */
export function findUniqueDate(arrayData: any) {
  /** fetch the unique dates */
  return [
    ...new Set(
      arrayData.map((pairObject) => {
        return moment(pairObject.created_at).format('YYYY-MM-DD');
      })
    )
  ];
}

export function findUniqueDateFromTimeStamp(arrayData) {
  return [
    ...new Set(
      arrayData.map((object) => {
        const timestamp = object.Volumn_timestamp;
        return moment.unix(timestamp).format('YYYY-MM-DD');
      })
    )
  ];
}
