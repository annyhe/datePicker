// These tests are examples to get you started on how how to test
// Lightning Web Components using the Jest testing framework.
//
// See the LWC Recipes Open Source sample application for many other
// test scenarios and best practices.
//
// https://github.com/trailheadapps/lwc-recipes-oss

import { createElement } from 'lwc';
import MyApp from 'my/app';

describe('my-app', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // change to set date
    it('onclick previous month date, update selectedValue', () => {
        const element = createElement('my-app', {
            is: MyApp
        });
        document.body.appendChild(element);

        const todayElem = element.shadowRoot.querySelector('td.not-current');

        expect(todayElem).toBeDefined();
        return Promise.resolve()
            .then(() => {
                todayElem.click();
            })
            .then(() => {
                expect(
                    new Date(
                        element.shadowRoot.querySelector(
                            '.selectedDate'
                        ).textContent
                    ) < new Date()
                ).toBe(true);
            });
    });

    it('some days are greyed out', () => {
        const element = createElement('my-app', {
            is: MyApp
        });
        document.body.appendChild(element);

        const greyedElems = element.shadowRoot.querySelectorAll('.not-current');
        expect(greyedElems.length).toBeGreaterThan(1);
    });

    it('show current year', () => {
        const element = createElement('my-app', {
            is: MyApp
        });
        document.body.appendChild(element);
        const container = element.shadowRoot.querySelector('thead');
        // what is an alternative to textContent?
        expect(container.textContent).toContain(new Date().getFullYear());
    });

    it('contains a Previous button', () => {
        const element = createElement('my-app', {
            is: MyApp
        });
        document.body.appendChild(element);

        const previousButton = element.shadowRoot.querySelector('.btnPrev');

        expect(previousButton).toBeDefined();
        expect(previousButton.textContent).toEqual('PREV');
    });

    it('contains a Next button', () => {
        const element = createElement('my-app', {
            is: MyApp
        });
        document.body.appendChild(element);

        const nextButton = element.shadowRoot.querySelector('.btnNext');

        expect(nextButton).toBeDefined();
        expect(nextButton.textContent).toEqual('NEXT');
    });
});
