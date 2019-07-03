import { LightningElement, track } from 'lwc';
import moment from 'moment';

export default class CalendarWithMoment extends LightningElement {
    initializeDatepicker;
    @track dateContext = moment();
    selectedDate = moment();
    today = moment();
    lastClass;

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

    setSelected(e) {
        const selectedDate = this.template.querySelector('.selected');
        if (selectedDate) {
            selectedDate.className = this.lastClass;
        }

        const date = e.target.dataset.date;
        this.dateContext = moment(date);
        this.lastClass = e.target.className;
        e.target.className = 'selected';
    }

    cleanCalendar() {
        const calendarHolder = this.template.querySelector('.calendarHolder');
        if (calendarHolder) {
            while (calendarHolder.firstChild) {
                calendarHolder.removeChild(calendarHolder.firstChild);
            }
        }
        return calendarHolder;
    }

    drawCalendar() {
        const calendarHolder = this.cleanCalendar();
        const startWeek = this.dateContext.startOf('month').isoWeek();
        // In case last week is in next year
        const start = moment(this.dateContext).startOf('month');
        const numWeeks = moment.duration(moment(this.dateContext).endOf('month') - start).weeks() + 1;        
        for (let week = startWeek; week <= startWeek + numWeeks; week++) {
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
