document.addEventListener('DOMContentLoaded', () => {

    // ===== Banner va sahifa animatsiyalari =====
    const lines = document.querySelectorAll('.banner .line');
    lines.forEach((line, index) => setTimeout(() => line.classList.add('visible'), index * 400));

    const images = document.querySelectorAll('.images img');
    images.forEach((img, index) => setTimeout(() => img.classList.add('visible'), 800 + index * 300));

    const buttons = document.querySelectorAll('.button');
    buttons.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'scale(0.8)';
        btn.style.transition = 'all 0.6s ease';
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
        }, 1200 + index * 100);
    });

    // Ma'ruza va amaliy sahifa sarlavhalari
    if (document.querySelector('.lessons-page')) {
        const title = document.querySelector('.page-title');
        if (title) setTimeout(() => title.classList.add('visible'), 300);

        const lessonButtons = document.querySelectorAll('.lesson-btn');
        lessonButtons.forEach((btn, index) => setTimeout(() => btn.classList.add('visible'), 600 + index * 120));
    }

    // ===== Qidiruv toggle =====
    const searchIcon = document.querySelector('.search-icon');
    const searchInput = document.querySelector('.search-input');
    if (searchIcon && searchInput) {
        searchIcon.addEventListener('click', () => {
            searchInput.classList.toggle('visible');
            if (searchInput.classList.contains('visible')) searchInput.focus();
        });
        document.addEventListener('click', (e) => {
            if (!searchIcon.contains(e.target) && !searchInput.contains(e.target)) {
                searchInput.classList.remove('visible');
            }
        });
    }

    // ===== Matritsa interaktiv bloki =====
    let lastResult = null;

    const generateBtn = document.getElementById('generate');
    const calculateBtn = document.getElementById('calculate');
    const showGraphBtn = document.getElementById('show-graph');

    // DOM elementlarini olish
    const rowsAInput = document.getElementById('rowsA');
    const colsAInput = document.getElementById('colsA');
    const rowsBInput = document.getElementById('rowsB');
    const colsBInput = document.getElementById('colsB');

    // Matritsa maydonlarini yaratish
    generateBtn?.addEventListener('click', () => {
        const m = +rowsAInput.value;
        const n = +colsAInput.value;
        const n2 = +rowsBInput.value;
        const k = +colsBInput.value;

        if (n !== n2) {
            alert("A ustunlari B qatorlariga teng bo‘lishi kerak!");
            return;
        }

        const box = document.getElementById('matrix-inputs');
        box.innerHTML = '';
        box.appendChild(createMatrixInputs("A", m, n));
        box.appendChild(createMatrixInputs("B", n, k));

        calculateBtn.style.display = 'inline-block';
    });

    function createMatrixInputs(name, rows, cols) {
        const div = document.createElement('div');
        div.innerHTML = `<h4>${name} matritsasi</h4>`;
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.style.marginBottom = '4px';
            for (let j = 0; j < cols; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.dataset.m = name;
                input.dataset.r = i;
                input.dataset.c = j;
                input.style.width = '60px';
                input.style.marginRight = '4px';
                row.appendChild(input);
            }
            div.appendChild(row);
        }
        return div;
    }

    // Hisoblash
    calculateBtn?.addEventListener('click', () => {
        const A = readMatrix("A");
        const B = readMatrix("B");
        const operation = document.querySelector('input[name="operation"]:checked')?.value || 'multiply';

        const steps = [];
        let C;

        try {
            if (operation === 'add') C = addMatrices(A, B, steps);
            else if (operation === 'subtract') C = subtractMatrices(A, B, steps);
            else C = multiplyMatrices(A, B, steps);
        } catch (e) {
            alert(e.message);
            return;
        }

        lastResult = C;
        document.getElementById('steps-output').textContent = steps.join('\n');
        document.getElementById('matrixC').textContent = C.map(r => r.join('\t')).join('\n');
        showGraphBtn.style.display = 'inline-block';
    });

    function readMatrix(name) {
        const inputs = [...document.querySelectorAll(`input[data-m="${name}"]`)];
        const rows = Math.max(...inputs.map(i => +i.dataset.r)) + 1;
        const cols = Math.max(...inputs.map(i => +i.dataset.c)) + 1;
        const m = Array.from({ length: rows }, () => Array(cols).fill(0));
        inputs.forEach(i => m[i.dataset.r][i.dataset.c] = Number(i.value || 0));
        return m;
    }

    function addMatrices(a, b, steps) {
        if (a.length !== b.length || a[0].length !== b[0].length) throw new Error('Matritsalar o‘lchamlari mos emas');
        let res = [];
        for (let i = 0; i < a.length; i++) {
            res[i] = [];
            for (let j = 0; j < a[0].length; j++) {
                res[i][j] = a[i][j] + b[i][j];
                steps.push(`C[${i + 1},${j + 1}] = ${a[i][j]} + ${b[i][j]} = ${res[i][j]}`);
            }
        }
        return res;
    }

    function subtractMatrices(a, b, steps) {
        if (a.length !== b.length || a[0].length !== b[0].length) throw new Error('Matritsalar o‘lchamlari mos emas');
        let res = [];
        for (let i = 0; i < a.length; i++) {
            res[i] = [];
            for (let j = 0; j < a[0].length; j++) {
                res[i][j] = a[i][j] - b[i][j];
                steps.push(`C[${i + 1},${j + 1}] = ${a[i][j]} - ${b[i][j]} = ${res[i][j]}`);
            }
        }
        return res;
    }

    function multiplyMatrices(a, b, steps) {
        if (a[0].length !== b.length) throw new Error('A ustunlari soni B qatorlariga teng bo‘lishi kerak');
        let res = Array(a.length).fill().map(() => Array(b[0].length).fill(0));
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b[0].length; j++) {
                for (let k = 0; k < a[0].length; k++) {
                    res[i][j] += a[i][k] * b[k][j];
                    steps.push(`C[${i + 1},${j + 1}] += ${a[i][k]}×${b[k][j]} = ${res[i][j]}`);
                }
            }
        }
        return res;
    }

    showGraphBtn?.addEventListener('click', () => {
        if (lastResult) render3DGraph(lastResult);
    });

    // ===== 3D grafik =====
    function render3DGraph(matrix) {
        const container = document.getElementById('3d-graph');
        container.innerHTML = '';
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a1a);
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / 400, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, 400);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(0.15, 32, 32);
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(j / matrix[0].length, 1, 0.5 + matrix[i][j] / 100)
                });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(j * 2 - matrix[0].length, -i * 2 + matrix.length, matrix[i][j] / 10);
                scene.add(sphere);
            }
        }

        camera.position.z = 15;
        camera.position.y = 5;
        camera.lookAt(0, 0, 0);

        function animate() {
            requestAnimationFrame(animate);
            scene.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();
    }

});
