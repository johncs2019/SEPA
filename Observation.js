class Observation {
    constructor(dteString, valRainfall, period) {
        this.setObservationDateTimes(dteString, period);
        this.setRainfallDetails(valRainfall, period);
    }

    isMonthly(period) {
        return (period === 2);
    }

    isDaily(period) {
        return (period === 1);
    }

    setObservationDateTimes(dteString, period) {
        this.ObservationDate = this.setDateFromString(dteString, false, false);
        if (!this.isMonthly(period) && !this.isDaily(period)) {
            this.ObservationTime = this.setDateFromString(dteString, true, false);
            var EndPoint = this.setDateFromString(dteString, true, true);
            if (this.ObservationTime <= EndPoint) {
                this.ObservationDate = new DateTime(this.ObservationDate.setDate(this.ObservationDate.getDate() - 1));
            }
        }
    }

    setRainfallDetails(valRainfall, period) {
        this.Rainfall = Number(valRainfall);
        if (this.isDaily(period)) {
            this.isDry = (this.Rainfall === 0 ? 1 : 0);
            this.isRainDay = (this.Rainfall >= 1 ? 1 : 0);
        }
    }

    setDateFromString(dteString, isTime, isStart) {
        let dteParts = dteString.split(" ");
        let isMonthYear = (dteParts[0].length === 3);
        let dyParts =  (!isMonthYear ? dteParts[0].split('/') : undefined);
        let tmeParts = (!isMonthYear ? dteParts[1].split(':') : undefined);
        let dy = (!dyParts ? 1 : Number(dyParts[0]));
        let mth = (!dyParts ? this.setMonthFromAbbrev(dteParts[0]) : Number(dyParts[1]));
        let yr = (!dyParts ? Number(dteParts[1]) : Number(dyParts[2]));
        if (isTime) {
            let hr = (!tmeParts ? 0 : (isStart ? 9 : Number(tmeParts[0])));
            let mn = (!tmeParts ? 0 : (isStart ? 0 : Number(tmeParts[1])));
            let sc = (!tmeParts ? 0 : (isStart ? 0 : Number(tmeParts[2])));
            return new DateTime(Date.UTC(yr, mth - 1, dy, hr, mn, sc, 0))
        } else {
            return new DateTime(Date.UTC(yr, mth - 1, dy));
        }
    }

    setMonthFromAbbrev(abbrev) {
        var monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return Number(monthArr.indexOf(abbrev) + 1);
    }
}