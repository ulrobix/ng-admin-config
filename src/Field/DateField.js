import Field from "./Field";

function comparator(value1, value2) {
    value1 = value1.getTime();
    value2 = value2.getTime();
    if (value1 > value2) return 1;
    else if (value1 < value2) return -1;
    else return 0;
}

class DateField extends Field {
    constructor(name) {
        super(name);
        
        this._format = null;
        this._parse = function(date) {
            if (date instanceof Date) {
                // the datepicker returns a JS Date object, with hours, minutes and timezone
                // in order to convert it back to date, we must remove the timezone, then
                // remove hours and minutes
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

                let dateString = date.toJSON();
                return dateString ? dateString.substr(0,10) : null;
            }
            return date;
        };
        this._type = "date";
        this._comparator = comparator;
    }

    format(value) {
        if (!arguments.length) return this._format;
        this._format = value;
        return this;
    }

    parse(value) {
        if (!arguments.length) return this._parse;
        this._parse = value;
        return this;
    }
}

export default DateField;
