import { Comparable, TimeUnit } from '../../types';
import { round } from '../../utils/math';

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

    public format() {
        const duration = this.toMs();

        let amount = duration.getAmount();
        let unit = TimeUnit.Millisecond;
    
        // ms -> s
        if (amount >= 1_000) {
            amount /= 1_000;
            unit = TimeUnit.Second;
    
            // s -> m
            if (amount >= 60) {
                amount /= 60;
                unit = TimeUnit.Minute;
    
                // m -> h
                if (amount >= 60) {
                    amount /= 60;
                    unit = TimeUnit.Hour;
    
                    // h -> d
                    if (amount >= 24) {
                        amount /= 24;
                        unit = TimeUnit.Day;
                    }
                }
            }
        }
    
        return `${round(amount, 1)}${unit}`;
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