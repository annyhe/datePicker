// These tests are examples to get you started on how how to test
// Lightning Web Components using the Jest testing framework.
//
// See the LWC Recipes Open Source sample application for many other
// test scenarios and best practices.
//
// https://github.com/trailheadapps/lwc-recipes-oss

import { createElement } from 'lwc';
import DatePicker from 'my/datePicker';

describe('date-picker', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('contains two button containers', () => {
        const element = createElement('my-date-picker', {
            is: DatePicker
        });
        document.body.appendChild(element);

        const greetingEls = element.shadowRoot.querySelectorAll('.buttonContainer');

        expect(greetingEls.length).toBe(2);        
    });

    it('contains certain days of the current month', () => {
        const element = createElement('my-date-picker', {
            is: DatePicker
        });
        document.body.appendChild(element);

        const greetingEls = element.shadowRoot.querySelectorAll('.date');

        expect(greetingEls.length).toBeGreaterThan(27);        
    });    

    it('contains some days of the previous/next month', () => {
        const element = createElement('my-date-picker', {
            is: DatePicker
        });
        document.body.appendChild(element);

        const greetingEls = element.shadowRoot.querySelectorAll('.padder');

        expect(greetingEls.length).toBeGreaterThan(1);        
    });        

    it('contains today', () => {
        const element = createElement('my-date-picker', {
            is: DatePicker
        });
        document.body.appendChild(element);

        const greetingEls = element.shadowRoot.querySelectorAll('.today');

        expect(greetingEls.length).toEqual(1);        
    });        
});
