import http from 'k6/http';
import {sleep, check} from "k6";
import {Counter} from "k6/metrics";

const host = 'http://application:8080';
const errors = new Counter("errors");

const baselineScenario = {
    executor: 'ramping-vus',
    exec: 'baseline',
    startVUs: 0,
    stages: [
        {duration: '10s', target: 20},
        {duration: '10s', target: 20},
        {duration: '5s', target: 50},
        {duration: '10s', target: 50},
        {duration: '15s', target: 0},
    ],
    startTime: '0m'
};

const exhaustDatasourceThreadsScenario = {
    executor: 'ramping-vus',
    exec: 'exhaustDatasourceThreads',
    startVUs: 0,
    stages: [
        {duration: '10s', target: 10},
        {duration: '10s', target: 10},
        {duration: '5s', target: 15},
        {duration: '10s', target: 15},
        {duration: '15s', target: 0},
    ],
    startTime: '2m'
};

const exhaustHeapMemoryScenario = {
    executor: 'ramping-vus',
    exec: 'exhaustHeapMemory',
    startVUs: 0,
    stages: [
        {duration: '10s', target: 10},
        {duration: '10s', target: 10},
        {duration: '5s', target: 20},
        {duration: '10s', target: 20},
        {duration: '20s', target: 0},
    ],
    startTime: '4m'
};

const exhaustTomcatThreadsScenario = {
    executor: 'ramping-vus',
    exec: 'exhaustTomcatThreads',
    startVUs: 0,
    stages: [
        {duration: '10s', target: 20},
        {duration: '10s', target: 20},
        {duration: '5s', target: 30},
        {duration: '10s', target: 30},
        {duration: '30s', target: 0},
    ],
    startTime: '6m'
};

const overloadCpuScenario = {
    executor: 'ramping-vus',
    exec: 'overloadCpu',
    startVUs: 0,
    stages: [
        {duration: '10s', target: 5},
        {duration: '15s', target: 5},
        {duration: '5s', target: 15},
        {duration: '15s', target: 15},
        {duration: '15s', target: 0},
    ],
    startTime: '8m'
};

const overloadGarbageCollectorScenario = {
    executor: 'ramping-vus',
    exec: 'overloadGarbageCollector',
    startVUs: 0,
    stages: [
        {duration: '10s', target: 10},
        {duration: '10s', target: 10},
        {duration: '5s', target: 15},
        {duration: '10s', target: 15},
        {duration: '15s', target: 0},
    ],
    startTime: '10m'
};

export let options = {
    discardResponseBodies: true,
    scenarios: {
        baseline: baselineScenario,
        exhaustTomcatThreads: exhaustTomcatThreadsScenario,
        exhaustDatasourceThreads: exhaustDatasourceThreadsScenario,
        exhaustHeapMemory: exhaustHeapMemoryScenario,
        overloadCpu: overloadCpuScenario,
        overloadGarbageCollector: overloadGarbageCollectorScenario
    },
};

export function baseline() {
    let res = http.get(host + '/baseline');
    checkResultStatus(res);
    sleep(0.1);
}

export function exhaustTomcatThreads() {
    let res = http.get(host + '/memory?bytes=10&milliseconds=500');
    checkResultStatus(res);
    sleep(0.1);
}

export function exhaustDatasourceThreads() {
    let res = http.get(host + '/datasource?depth=0&milliseconds=100');
    checkResultStatus(res);
    sleep(0.1);
}

export function exhaustHeapMemory() {
    let res = http.get(host + '/memory?bytes=50000000&milliseconds=100');
    checkResultStatus(res);
    sleep(0.1);
}

export function overloadCpu() {
    let res = http.get(host + '/cpu?load=10000');
    checkResultStatus(res);
    sleep(0.2);
}

export function overloadGarbageCollector() {
    let res = http.get(host + '/allocate?objects=250000&depth=5');
    checkResultStatus(res);
    sleep(0.1);
}

function checkResultStatus(res) {
    let failed = check(res, { "status is 200": (r) => r.status === 200 });
    if (!failed) {
        errors.add(1);
    }
}
