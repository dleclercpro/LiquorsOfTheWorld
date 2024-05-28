import { NO_TIME } from '../constants';
import { Comparable } from '../types';
import { TimeUnit } from '../types/TimeTypes';

class TimeDurationComparator {
    public static compare(a: TimeDuration, b: TimeDuration) {
        if (a.toMs().getAmount() < b.toMs().getAmount()) return -1;
        if (a.toMs().getAmount() > b.toMs().getAmount()) return 1;
        return 0;
    }
}



class TimeDuration implements Comparable {
    private amount: number;
    private unit: TimeUnit;

    public constructor(amount: number, unit: TimeUnit) {
        this.amount = amount;
        this.unit = unit;
    }

    public serialize() {
        return this.toMs().getAmount();
    }

    public static deserialize(str: string) {
        return new TimeDuration(parseInt(str, 10), TimeUnit.Millisecond);
    }

    public isZero() {
        return this.amount === 0;
    }

    public getAmount() {
        return this.amount;
    }

    public getUnit() {
        return this.unit;
    }

    public add(other: TimeDuration) {
        return new TimeDuration(this.toMs().getAmount() + other.toMs().getAmount(), TimeUnit.Millisecond);
    }

    public subtract(other: TimeDuration) {
        return new TimeDuration(this.toMs().getAmount() - other.toMs().getAmount(), TimeUnit.Millisecond);
    }

    public compare(other: TimeDuration) {
        return TimeDurationComparator.compare(this, other);
    }

    public smallerThanOrEquals(other: TimeDuration) {
        return this.smallerThan(other) || this.equals(other);
    }

    public smallerThan(other: TimeDuration) {
        return this.compare(other) === -1;
    }

    public equals(other: TimeDuration) {
        return this.compare(other) === 0;
    }

    public greaterThan(other: TimeDuration) {
        return this.compare(other) === 1;
    }

    public greaterThanOrEquals(other: TimeDuration) {
        return this.greaterThan(other) || this.equals(other);
    }

    public format(resolutionUnit: TimeUnit = TimeUnit.Second) {
        let remaining = this.add(NO_TIME);

        let d = 0;
        let h = 0;
        let m = 0;
        let s = 0;
        let ms = 0;

        const days = remaining.to(TimeUnit.Day).getAmount();
        if (days >= 1) {
            d = Math.floor(days);
            remaining = remaining.subtract(new TimeDuration(d, TimeUnit.Day));
        }

        const hours = remaining.to(TimeUnit.Hour).getAmount();
        if (hours >= 1) {
            h = Math.floor(hours);
            remaining = remaining.subtract(new TimeDuration(h, TimeUnit.Hour));
        }

        const minutes = remaining.to(TimeUnit.Minute).getAmount();
        if (minutes >= 1) {
            m = Math.floor(minutes);
            remaining = remaining.subtract(new TimeDuration(m, TimeUnit.Minute));
        }

        const seconds = remaining.to(TimeUnit.Second).getAmount();
        if (seconds >= 1) {
            s = Math.floor(seconds);
            remaining = remaining.subtract(new TimeDuration(s, TimeUnit.Second));
        }

        const milliseconds = remaining.to(TimeUnit.Millisecond).getAmount();
        if (milliseconds >= 1) {
            ms = Math.floor(milliseconds);
            remaining = remaining.subtract(new TimeDuration(ms, TimeUnit.Millisecond));
        }

        // Return up to the given time unit
        let result = '';
        if (d > 0) {
            result = result !== '' ? result + ` ${d}${TimeUnit.Day}` : `${d}${TimeUnit.Day}`;
        }
        if (resolutionUnit === TimeUnit.Day) {
            return result;
        }
        if (h > 0) {
            result = result !== '' ? result + ` ${h}${TimeUnit.Hour}` : `${h}${TimeUnit.Hour}`;
        }
        if (resolutionUnit === TimeUnit.Hour) {
            return result;
        }
        if (m > 0) {
            result = result !== '' ? result + ` ${m}${TimeUnit.Minute}` : `${m}${TimeUnit.Minute}`;
        }
        if (resolutionUnit === TimeUnit.Minute) {
            return result;
        }
        if (s > 0) {
            result = result !== '' ? result + ` ${s}${TimeUnit.Second}` : `${s}${TimeUnit.Second}`;
        }
        if (resolutionUnit === TimeUnit.Second) {
            return result;
        }
        result = result !== '' ? result + ` ${ms}${TimeUnit.Millisecond}` : `${ms}${TimeUnit.Millisecond}`;
        return result;
    }

    public to(unit: TimeUnit) {
        let amount = 0;

        const ms = this.toMs().getAmount();
        
        switch (unit) {
            case TimeUnit.Day:
                amount = ms / 24 / 3_600 / 1_000;
                break;
            case TimeUnit.Hour:
                amount = ms / 3_600 / 1_000;
                break;
            case TimeUnit.Minute:
                amount = ms / 60 / 1_000;
                break;
            case TimeUnit.Second:
                amount = ms / 1_000;
                break;
            case TimeUnit.Millisecond:
                amount = ms;
                break;
            default:
                throw new Error('INVALID_TIME_UNIT');
        }

        return new TimeDuration(amount, unit); 
    }

    public toMs() {
        let amount = 0;
        
        switch (this.unit) {
            case TimeUnit.Day:
                amount = this.amount * 24 * 3_600 * 1_000;
                break;
            case TimeUnit.Hour:
                amount = this.amount * 3_600 * 1_000;
                break;
            case TimeUnit.Minute:
                amount = this.amount * 60 * 1_000;
                break;
            case TimeUnit.Second:
                amount = this.amount * 1_000;
                break;
            case TimeUnit.Millisecond:
                amount = this.amount;
                break;
            default:
                throw new Error('INVALID_TIME_UNIT');
        }

        return new TimeDuration(amount, TimeUnit.Millisecond);
    }
}

export default TimeDuration;