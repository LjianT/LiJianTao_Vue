let SIGN_REGEXP = /([yMdhsm])(\1*)/g;
let DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding (s, len) {
  len = len - (s + '').length;
  for (let i = 0; i < len; i++) {
    s = '0' + s;
  }
  return s;
}

const formatDate = {
    // 格式化时间
    // 传入 时间 跟 格式
    format: function (date, pattern) {
        // console.log('date__', date)
        pattern = pattern || DEFAULT_PATTERN;
        return pattern.replace(SIGN_REGEXP, function ($0) {
            switch ($0.charAt(0)) {
            case 'y':
                return padding(date.getFullYear(), $0.length);
            case 'M':
                return padding(date.getMonth() + 1, $0.length);
            case 'd':
                return padding(date.getDate(), $0.length);
            case 'w':
                return date.getDay() + 1;
            case 'h':
                return padding(date.getHours(), $0.length);
            case 'm':
                return padding(date.getMinutes(), $0.length);
            case 's':
                return padding(date.getSeconds(), $0.length);
            }
        });
      },
};

export default formatDate;