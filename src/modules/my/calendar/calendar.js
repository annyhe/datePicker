import { LightningElement, track } from 'lwc';

export default class App extends LightningElement {
    initializedCal;
    @track selectedDate = 'yyyy/mm/dd';
    currMonth = new Date().getMonth();
    currDay = new Date().getDay();
    currYear = new Date().getFullYear();

    DaysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Months, stating on January
    Months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    addDateEventListener() {
        const classname = this.template.querySelectorAll('td');
        for (let i = 0; i < classname.length; i++) {
            classname[i].setAttribute('lwc:dom', 'manual');
            classname[i].addEventListener(
                'click',
                this.selectDate.bind(this),
                false
            );
        }
    }

    showMonth(y, m) {
        const firstDayOfMonth = new Date(y, m, 1).getDay();
        const lastDateOfMonth = new Date(y, m + 1, 0).getDate();
        const lastDayOfLastMonth =
            m === 0
                ? new Date(y - 1, 11, 0).getDate()
                : new Date(y, m, 0).getDate();

        // Write selected month and year
        const foundTable = this.template.querySelector('table');
        if (foundTable) {
            const parentNode = foundTable.parentNode;
            while (parentNode.firstChild) {
                parentNode.removeChild(parentNode.firstChild);
            }
        }

        const tableElem = document.createElement('table');
        const tableHeadElem = document.createElement('thead');
        const tableHeadRowElem = document.createElement('tr');
        const tableHeadCellElem = document.createElement('td');
        tableHeadCellElem.setAttribute('colspan', 7);
        tableHeadCellElem.textContent = this.Months[m] + ' ' + y;
        tableHeadRowElem.appendChild(tableHeadCellElem);
        tableHeadElem.appendChild(tableHeadRowElem);
        tableElem.appendChild(tableHeadElem);

        const headerRow = document.createElement('tr');
        headerRow.setAttribute('class', 'days');

        // Write the header of the days of the week
        for (let i = 0; i < this.DaysOfWeek.length; i++) {
            const cell = document.createElement('td');
            cell.textContent = this.DaysOfWeek[i];
            headerRow.appendChild(cell);
        }

        tableElem.appendChild(headerRow);

        // Write the days
        let i = 1;
        let newRow = document.createElement('tr');
        do {
            let dow = new Date(y, m, i).getDay();
            // If Sunday, start new row
            if (dow === 0) {
                newRow = document.createElement('tr');
            }
            // If not Sunday but first day of the month
            // it will write the last days from the previous month
            else if (i === 1) {
                tableElem.appendChild(newRow);
                let k = lastDayOfLastMonth - firstDayOfMonth + 1;
                for (let j = 0; j < firstDayOfMonth; j++) {
                    const tableCell = document.createElement('td');
                    tableCell.setAttribute('class', 'not-current');
                    tableCell.textContent = k;
                    newRow.appendChild(tableCell);
                    k++;
                }
            }

            // Write the current day in the loop
            let chk = new Date();
            let chkY = chk.getFullYear();
            let chkM = chk.getMonth();
            if (
                chkY === this.currYear &&
                chkM === this.currMonth &&
                i === this.currDay
            ) {
                const todayCell = document.createElement('td');
                todayCell.setAttribute('class', 'today');
                todayCell.textContent = i;
                newRow.appendChild(todayCell);
            } else {
                const todayCell = document.createElement('td');
                todayCell.setAttribute('class', 'normal');
                todayCell.textContent = i;
                newRow.appendChild(todayCell);
            }
            // If Saturday, closes the row
            if (dow === 6) {
                tableElem.appendChild(newRow);
                newRow = document.createElement('tr');
            }
            // If not Saturday, but last day of the selected month
            // it will write the next few days from the next month
            else if (i === lastDateOfMonth) {
                let k = 1;
                for (dow; dow < 6; dow++) {
                    const nextMonthCell = document.createElement('td');
                    nextMonthCell.setAttribute('class', 'not-current');
                    nextMonthCell.textContent = k;
                    newRow.appendChild(nextMonthCell);
                    k++;
                }
            }

            i++;
        } while (i <= lastDateOfMonth);
        tableElem.appendChild(newRow);

        // Write HTML to the div
        this.template.querySelector('.divCal').appendChild(tableElem);
        // this.template.querySelector('.divCal').innerHTML = html;
        this.addDateEventListener();
    }

    showcurr() {
        this.showMonth(this.currYear, this.currMonth);
    }

    // Goes to next month
    nextMonth() {
        if (this.currMonth === 11) {
            this.currMonth = 0;
            this.currYear = this.currYear + 1;
        } else {
            this.currMonth = this.currMonth + 1;
        }
        this.showcurr();
    }

    // Goes to previous month
    previousMonth() {
        if (this.currMonth === 0) {
            this.currMonth = 11;
            this.currYear = this.currYear - 1;
        } else {
            this.currMonth = this.currMonth - 1;
        }

        this.showcurr();
    }

    getMonth(e) {
        let formattedMonth = this.currMonth + 1;
        if (e.target.classList.contains('not-current')) {
            // returns true for previous month, false for next month
            const parentNode = e.target.parentNode;
            formattedMonth = parentNode.firstElementChild.classList.contains(
                'not-current'
            )
                ? formattedMonth - 1
                : formattedMonth + 1;
        }

        if (formattedMonth < 10) {
            formattedMonth = '0' + formattedMonth;
        }

        return formattedMonth;
    }

    selectDate(e) {
        let formattedDay = e.target.textContent;
        if (formattedDay.length < 2) {
            formattedDay = '0' + formattedDay;
        }
        const formattedMonth = this.getMonth(e);
        this.selectedDate =
            this.currYear + '/' + formattedMonth + '/' + formattedDay;
    }

    renderedCallback() {
        if (this.initializedCal) {
            return;
        }

        this.initializedCal = true;
        this.showcurr();
    }
}
