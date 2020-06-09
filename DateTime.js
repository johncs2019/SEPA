class DateTime extends Date {

    getMonthAbbrev(mth) {
        if (mth === undefined) mth = this.getMonth();
        var monthArr = ["Jan","Feb","Mar","Apr","May","jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return `${monthArr[mth]}`;
    }

    getMonthYear(mth, yr) {
        if (mth === undefined) mth = this.getMonth();
        if (yr === undefined) yr = this.getFullYear();
        return (this.getMonthAbbrev(mth) + " " + String(yr).padStart(4, '0'));
    }

    getFullDate(dy, mth, yr) {
        if (mth === undefined) mth = this.getMonth();
        if (yr === undefined) yr = this.getFullYear();
        if (dy === undefined) dy = this.getDate();
        return (dy + "/" + String(mth + 1).padStart(2, '0') + "/" + String(yr).padStart(4, '0'));
    }

    getFullDateTime(dy, mth, yr, hr, mn, sc) {
        if (mth === undefined) mth = this.getMonth();
        if (yr === undefined) yr = this.getFullYear();
        if (dy === undefined) dy = this.getDate();
        if (hr === undefined) hr = this.getHours();
        if (mn === undefined) mn = this.getMinutes();
        if (sc === undefined) sc = this.getSeconds();
        return (this.getFullDate(dy, mth, yr) + " " + String(hr).padStart(2, '0') + ":" + String(mn).padStart(2, '0') + ":" + String(sc).padStart(2, '0'));
    }
}
