const soleil = document.querySelector('.soleil');

const morning = {
    right: -100,
    y: -50,
    size: 25
};

const noon = {
    right: 200,
    y: 50,
    size: 100
};

const evening = {
    right: -100,
    y: 105,
    size: 35
};

const colors = [
    {
        position: 0,
        background: '#10182F',
        text: '#F8F5EE'
    },
    {
        position: 0.10,
        background: '#4F86C6',
        text: '#171717'
    },
    {
        position: 0.5,
        background: '#87BCE8',
        text: '#171717'
    },
    {
        position: 0.75,
        background: '#3F6FAD',
        text: '#F8F5EE'
    },
    {
        position: 1,
        background: '#10182F',
        text: '#F8F5EE'
    }
];

function lerp(start, end, progress) {
    return start + (end - start) * progress;
}

function interpolateColor(color1, color2, progress) {
    const a = color1.match(/\w\w/g).map(value => parseInt(value, 16));
    const b = color2.match(/\w\w/g).map(value => parseInt(value, 16));

    const result = a.map((value, index) => {
        return Math.round(
            lerp(value, b[index], progress)
        );
    });

    return `rgb(${result.join(', ')})`;
}

function getColor(progress, property) {
    for (let i = 0; i < colors.length - 1; i++) {
        const current = colors[i];
        const next = colors[i + 1];

        if (
            progress >= current.position &&
            progress <= next.position
        ) {
            const localProgress =
                (progress - current.position) /
                (next.position - current.position);

            return interpolateColor(
                current[property],
                next[property],
                localProgress
            );
        }
    }

    return colors[colors.length - 1][property];
}

function updateTextColor(progress) {

    if (progress <= 0.1) {

        const localProgress = progress / 0.1;

        const color = interpolateColor(
            '#F8F5EE',
            '#171717',
            localProgress
        );

        document.body.style.color = color;

    } else if (progress <= 0.7) {

        document.body.style.color = '#171717';

    } else {

        const localProgress =
            (progress - 0.7) / 0.3;

        const color = interpolateColor(
            '#171717',
            '#F8F5EE',
            localProgress
        );


        document.body.style.color = color;
    }
}

function updateSun() {
    const scrollMax =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress = window.scrollY / scrollMax;

    updateTextColor(progress);

    let right;
    let y;
    let size;

    if (progress <= 0.5) {

        const localProgress =
            progress / 0.5;

        right = lerp(
            morning.right,
            noon.right,
            localProgress
        );

        y = lerp(
            morning.y,
            noon.y,
            localProgress
        );

        size = lerp(
            morning.size,
            noon.size,
            localProgress
        );

    } else {

        const localProgress =
            (progress - 0.5) / 0.5;

        right = lerp(
            noon.right,
            evening.right,
            localProgress
        );

        y = lerp(
            noon.y,
            evening.y,
            localProgress
        );

        size = lerp(
            noon.size,
            evening.size,
            localProgress
        );
    }

    soleil.style.right = `${right}px`;
    soleil.style.top = `${y}%`;

    soleil.style.width = `${size}px`;
    soleil.style.height = `${size}px`;

    document.body.style.backgroundColor =
        getColor(progress, 'background');

    document.body.style.color =
        getColor(progress, 'text');
}

window.addEventListener('scroll', updateSun);

updateSun();