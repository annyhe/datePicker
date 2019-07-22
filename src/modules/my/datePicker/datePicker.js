import { LightningElement, api, track } from 'lwc';
import moment from 'moment';

const today = moment();
export default class DatePicker extends LightningElement {
    isDatePickerInitialized;
    @track dateContext = moment();
    @track selectedDate = moment();
    @track error;
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
        this.refreshDateNodes();
    }

    nextMonth() {
        this.dateContext = moment(this.dateContext).add(1, 'month');
        this.refreshDateNodes();
    }

    goToday() {
        this.selectedDate = today;
        this.dateContext = today;
        this.refreshDateNodes();
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
        
        // datePicker is defined or null
        return datePickerHolder;
    }

    refreshDateNodes() {
        const datePickerHolder = this.cleanDatePicker();
        if (!datePickerHolder) {
            this.error = 'Datepicker holder not found: element with class datePickerHolder was not rendered.';
            return;
        }

        // datePickerHolder is defined
        this.error = '';
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
                        if (day.isSame(today, 'day')) {
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
        if (this.isDatePickerInitialized) {
            return;
        }

        this.isDatePickerInitialized = true;
        this.refreshDateNodes();
    }
}
