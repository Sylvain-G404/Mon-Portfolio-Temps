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
        background: '#18213D',
        text: '#F8F5EE'
    },
    {
        position: 0.25,
        background: '#E8B86A',
        text: '#171717'
    },
    {
        position: 0.5,
        background: '#F5F1E6',
        text: '#171717'
    },
    {
        position: 0.75,
        background: '#C96A55',
        text: '#F8F5EE'
    },
    {
        position: 1,
        background: '#101525',
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

function updateSun() {
    const scrollMax =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress =
        window.scrollY / scrollMax;

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