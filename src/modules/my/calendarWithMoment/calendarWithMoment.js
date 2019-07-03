import { LightningElement, track } from 'lwc';
import moment from 'moment';

export default class CalendarWithMoment extends LightningElement {
    initializeDatepicker;
    today = moment();
    @track dateContext = moment();
    selectedDate = moment();

    get year() {
        return this.dateContext.format('Y');
    }
    get month() {
        return this.dateContext.format('MMMM');
    }
    get currentDate() {
        return this.dateContext.format('YYYY-MM-DD');
    }

    previousMonth() {
        this.dateContext = moment(this.dateContext).subtract(1, 'month');
        this.drawCalendar();
    }

    nextMonth() {
        this.dateContext = moment(this.dateContext).add(1, 'month');
        this.drawCalendar();
    }

    goToday() {
        this.selectedDate = this.today;
        this.dateContext = this.today;
        this.drawCalendar();
    }
    
    getCleanCalendar() {
        const calendarHolder = this.template.querySelector('.calendarHolder');
        if (calendarHolder) {
            while (calendarHolder.firstChild) {
                calendarHolder.removeChild(calendarHolder.firstChild);
            }
        }
        return calendarHolder;
    }

    drawCalendar() {
        const calendarHolder = this.getCleanCalendar();
        const startWeek = this.dateContext
            .startOf('month')
            .week();
        const endWeek = this.dateContext
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
    }

    renderedCallback() {
        if (this.initializeDatepicker) {
            return;
        }

        this.initializeDatepicker = true;
        this.drawCalendar();
    }
}
