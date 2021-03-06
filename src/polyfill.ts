if (!String.prototype.trim) {
    // trim polyfill
    String.prototype.trim = function _() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
}
if (!Function.prototype.bind) {
    // bind polyfill
    Function.prototype.bind = function __(oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        const aArgs = Array.prototype.slice.call(arguments, 1);
        const fToBind = this;
        const fNOP = function _() {};
        const fBound = function _() {
            return fToBind.apply(this instanceof fNOP ? this : oThis || this, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
if (!Array.prototype.map) {
    // map polyfill
    Array.prototype.map = function(callback, thisArg) {
        let T;
        let A;
        let k;
        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }
        // 1. 将O赋值为调用map方法的数组.
        const O = Object(this);
        // 2.将len赋值为数组O的长度.
        const len = O.length;
        // 3.如果callback不是函数,则抛出TypeError异常.
        if (Object.prototype.toString.call(callback) !== "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }
        // 4. 如果参数thisArg有值,则将T赋值为thisArg;否则T为undefined.
        if (thisArg) {
            T = thisArg;
        }
        // 5. 创建新数组A,长度为原数组O长度len
        A = new Array(len);
        // 6. 将k赋值为0
        k = 0;
        // 7. 当 k < len 时,执行循环.
        while (k < len) {
            let kValue;
            let mappedValue;
            // 遍历O,k为原数组索引
            if (k in O) {
                // kValue为索引k对应的值.
                kValue = O[ k ];
                // 执行callback,this指向T,参数有三个.分别是kValue:值,k:索引,O:原数组.
                mappedValue = callback.call(T, kValue, k, O);
                // 返回值添加到新数组A中.
                A[ k ] = mappedValue;
            }
            // k自增1
            k++;
        }
        // 8. 返回新数组A
        return A;
    };
}
if (typeof Object.assign !== "function") {
    Object.assign = function _(target) {
        if (target == null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }

        target = Object(target);
        for (let index = 1; index < arguments.length; index++) {
            const source = arguments[index];
            if (source != null) {
                for (const key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}
