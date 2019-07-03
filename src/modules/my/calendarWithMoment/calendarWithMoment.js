import { LightningElement } from 'lwc';
import moment from 'moment';

export default class CalendarWithMoment extends LightningElement {
    initializeDatepicker;
    today = moment();
    dateContext = moment();
    selectedDate = moment();

    get year() {
        return this.dateContext.format('Y');
    }
    get month() {
        return this.dateContext.format('MMMM');
    }
    get currentDate() {
        return this.dateContext.get('date');
    }

    previousMonth() {
        moment(this.dateContext).subtract(1, 'month');
    }

    nextMonth() {
        moment(this.dateContext).add(1, 'month');
    }

    goToday() {
        this.selectedDate = this.today;
        this.dateContext = this.today;
        this.drawCalendar();
    }

    drawCalendar() {
        // draw header 
        const calendarHolder = this.template.querySelector('.calendarHolder');
        const calendar = [];
        const startWeek = moment()
            .startOf('month')
            .week();
        const endWeek = moment()
            .endOf('month')
            .week();

        for (let week = startWeek; week <= endWeek; week++) {
            Array(7)
                .fill(0)
                .forEach((n, i) => {
                    const day = moment()
                        .week(week)
                        .startOf('week')
                        .clone()
                        .add(n + i, 'day');
                    const listElem = document.createElement('li');
                    if (day.month() === this.dateContext.month()) {
                        listElem.setAttribute('class', 'date');
                        listElem.setAttribute(
                            'data-date',
                            day.format('YYYY-MM-DD')
                        );
                    } else {
                        listElem.setAttribute('class', 'padder');
                    }
                    listElem.textContent = day.format('DD');
                    calendarHolder.appendChild(listElem);
                });
        }

        this.calendarString = JSON.stringify(calendar);
    }

    renderedCallback() {
        if (this.initializeDatepicker) {
            return;
        }

        this.initializeDatepicker = true;
        this.drawCalendar();
    }
}
