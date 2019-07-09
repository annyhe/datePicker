import { LightningElement, api, track } from 'lwc';
import moment from 'moment';

export default class DatePicker extends LightningElement {
    initializeDatepicker;
    @track dateContext = moment();
    @track selectedDate = moment();
    today = moment();
    lastClass;

    get formattedSelectedDate() {
        return this.selectedDate.format('YYYY-MM-DD');
    }
    get year() {
        return this.dateContext.format('Y');
    }
    get month() {
        return this.dateContext.format('MMMM');
    }

    previousMonth() {
        this.dateContext = moment(this.dateContext).subtract(1, 'month');
        this.setDateNodes();
    }

    nextMonth() {
        this.dateContext = moment(this.dateContext).add(1, 'month');
        this.setDateNodes();
    }

    goToday() {
        this.selectedDate = this.today;
        this.dateContext = this.today;
        this.setDateNodes();
    }

    @api
    setSelected(e) {
        const selectedDate = this.template.querySelector('.selected');
        if (selectedDate) {
            selectedDate.className = this.lastClass;
        }

        const date = e.target.dataset.date;
        this.selectedDate = moment(date);
        this.dateContext = moment(date);
        this.lastClass = e.target.className;
        e.target.className = 'selected';
    }

    cleanDatePicker() {
        const datePickerHolder = this.template.querySelector(
            '.datePickerHolder'
        );
        if (datePickerHolder) {
            while (datePickerHolder.firstChild) {
                datePickerHolder.removeChild(datePickerHolder.firstChild);
            }
        }
        return datePickerHolder;
    }

    setDateNodes() {
        const datePickerHolder = this.cleanDatePicker();
        const currentMoment = moment(this.dateContext);
        // startOf mutates moment, hence clone before use
        const start = this.dateContext.clone().startOf('month');
        const startWeek = start.isoWeek();
        // months do not always have the same number of weeks. eg. February
        const numWeeks =
            moment.duration(currentMoment.endOf('month') - start).weeks() + 1;
        for (let week = startWeek; week <= startWeek + numWeeks; week++) {
            Array(7)
                .fill(0)
                .forEach((n, i) => {
                    const day = currentMoment
                        .week(week)
                        .startOf('week')
                        .clone()
                        .add(n + i, 'day');
                    const listElem = document.createElement('li');
                    if (day.month() === this.dateContext.month()) {
                        if (day.isSame(this.today, 'day')) {
                            listElem.setAttribute('class', 'today');
                        } else if (day.isSame(this.selectedDate, 'day')) {
                            listElem.setAttribute('class', 'selected');
                        } else {
                            listElem.setAttribute('class', 'date');
                        }
                    } else {
                        listElem.setAttribute('class', 'padder');
                    }
                    listElem.setAttribute(
                        'data-date',
                        day.format('YYYY-MM-DD')
                    );
                    listElem.textContent = day.format('DD');
                    listElem.onclick = this.setSelected.bind(this);
                    datePickerHolder.appendChild(listElem);
                });
        }
    }

    renderedCallback() {
        if (this.initializeDatepicker) {
            return;
        }

        this.initializeDatepicker = true;
        this.setDateNodes();
    }
}
