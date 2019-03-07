const { wordsByEntropy } = require('../');
const EventEmitter = require('events');

const TAG = "words-iterator-full";

const events = new EventEmitter();

function cartesianSize(...nums) {
    let x = 1;
    for (const f of nums)
        x *= f;
    return x;
}

function* _iterCartesian(array, maxs, idx) {
    for (let i = 0; i < maxs[idx]; i++) {
        array[idx] = i;
        if (idx != array.length - 1)
            for (const a of _iterCartesian(array, maxs, idx+1))
                yield a;
        else
            yield array;
    }
    return;
}

function iterCartesian(...nums) {
    const array = new Int32Array(nums.length);
    return _iterCartesian(array, nums, 0);
}

const stats = {
    countByIterations: new Int32Array(101),
    fails: [],
};

const max = cartesianSize(21, 21, 21, 21, 24, 27);

let i = 0;

function printResults() {
    console.info(TAG, `Done, ${i} Iterations.`);
    console.info(TAG, "Iterations:");
    for (const i in stats.countByIterations) {
        const x = stats.countByIterations[i];
        if (x == 0) continue;
        console.info(TAG, ` - ${i}: ${x}`);
    }
}

process.on('SIGINT', () => {
    console.log("Interrupted");
    printResults();
    process.exit(0);
});

async function iterate() {
    for (const a of iterCartesian(21, 21, 21, 21, 24, 27)) {
        const words = wordsByEntropy.apply(null, a);
        stats.countByIterations[words[2]]++;
        if (words[2] == 100) {
            stats.fails.push({
                entropy: a,
                result: words
            });
        }

        if (i % 8192 == 0) {
            console.log(TAG, `${i} of ${max} (${(i / max * 100).toFixed(2)} %)`);
            // Yield to scheduler
            await new Promise((resolve) => setTimeout(resolve));
        }

        i++;
    }
    events.emit('done');
}

iterate();

events.on('done', () => printResults());
