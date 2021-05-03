// 根据时间戳转换为 时:分:秒

const getBootTime = timestamp => {
    if (!timestamp) {
        return "00:00:00";
    } else {
        let zero = n => {
            return n >= 10 ? n : "0" + n;
        };
        let h = zero(Math.floor(timestamp / 1000 / 3600));
        let m = zero(Math.floor((timestamp / 1000 - h * 3600) / 60));
        let s = zero(Math.floor(timestamp / 1000 - h * 3600 - m * 60));
        return `${h}:${m}:${s}`;
    }
};

export default getBootTime;

const DEFAULT_PATTERN = "hh:mm:ss";
const SIGN_REGEXP = /([dhsm])(\1*)/g;

function padZero(num, len) {
    return num.toString().padStart(len, "0");
}

export const getPatternTime = (timestamp, pattern) => {
    if (!timestamp) {
        return "00:00:00";
    } else {
        pattern = pattern || DEFAULT_PATTERN;

        let day = Math.floor(timestamp / 60 / 60 / 24);
        if (pattern.indexOf("d") == -1) {
            day = 0;
        }
        let hour = Math.floor((timestamp - day * 86400) / 60 / 60);
        let minute = Math.floor((timestamp - day * 86400 - hour * 3600) / 60);
        let second = Math.floor(
            timestamp - day * 86400 - hour * 3600 - minute * 60
        );

        return pattern.replace(SIGN_REGEXP, function($0) {
            console.log($0.charAt(0), $0.length);
            switch ($0.charAt(0)) {
                case "d":
                    return padZero(day, $0.length);
                case "h":
                    return padZero(hour, $0.length);
                case "m":
                    return padZero(minute, $0.length);
                case "s":
                    return padZero(second, $0.length);
            }
        });
    }
};
