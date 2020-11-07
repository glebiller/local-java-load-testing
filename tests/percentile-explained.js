import http from 'k6/http';
import {sleep, check} from "k6";
import {Counter} from "k6/metrics";

const host = 'http://application:8080';
const errors = new Counter("errors");

const splitScenario = {
    executor: 'ramping-vus',
    exec: 'split',
    startVUs: 0,
    stages: [
        {duration: '5s', target: 20},
        {duration: '1m', target: 20},
        {duration: '5s', target: 0},
    ],
    startTime: '2m'
};

const longTailScenario = {
    executor: 'ramping-vus',
    exec: 'longTail',
    startVUs: 0,
    stages: [
        {duration: '5s', target: 20},
        {duration: '1m', target: 20},
        {duration: '5s', target: 0},
    ],
    startTime: '0m'
};

export let options = {
    discardResponseBodies: true,
    scenarios: {
        split: splitScenario,
        longTail: longTailScenario
    }
};

export function split() {
    let distribution = Math.random();
    let milliseconds;
    if (distribution <= 0.15) {
        milliseconds = Math.abs(Math.round(random() * 250 - 125));
    } else {
        milliseconds = Math.round(random() * 250 + 250);
    }
    if (milliseconds < 0) {
        milliseconds = 0;
    }

    let res = http.get(host + '/memory?bytes=10&milliseconds=' + milliseconds);
    checkResultStatus(res);
    sleep(0.1);
}

export function longTail() {
    let distribution = Math.random();
    let milliseconds;
    if (distribution >= 0.90) {
        milliseconds = Math.round(random() * 1000 + 150);
    } else {
        milliseconds = Math.round(random() * 300);
    }
    if (milliseconds < 0) {
        milliseconds = 0;
    }

    let res = http.get(host + '/memory?bytes=10&milliseconds=' + milliseconds);
    checkResultStatus(res);
    sleep(0.1);
}

function checkResultStatus(res) {
    let failed = check(res, { "status is 200": (r) => r.status === 200 });
    if (!failed) {
        errors.add(1);
    }
}

function random() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0) return random();
    return num;
}
