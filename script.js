// --- إعدادات اللعبة والأسئلة (زي ما هي بدون تغيير) ---
const questions = [
    { q: "اكتر ايموجي بتسخدمه اي؟", options: ["🦥🦥🦥", "🤨🤨🤨", "🤥🤥🤥"], correct: 0 },
    { q: "انتا منين؟", options: ["المنيا", "المنيا تاني", "المنيا تالت"], correct: -1, msg: "معايا دليل رسمي انك من المنيااااااااااا" },
    { q: "من صاحب اغنية العب العب العب؟", options: ["ماريا", "اسلام كابنوجاا", "حسن شحاته"], correct: 0 },
    { q: "اين يقع مثل برمودا؟", options: ["المملكة المتحدة", "المملكة اللى مش متحددة", "العباسية"], correct: 2 },
    { q: "orange juice اسمه اي بالعربي؟", options: ["عصير برتقان", "عصير برتجاان", "عصير جوافه"], correct: 1 }
];

let currentQ = 0;
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- محرك الألعاب النارية الاحترافي (المطلوب) ---
class Particle {
    constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        // سرعة الشعاع واتجاهه
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
        this.gravity = 0.08;  // جاذبية خفيفة جداً لشكل واقعي
        this.friction = 0.98; // احتكاك الهواء لجعل الخيوط تتلاشى بانسيابية
        this.opacity = 1;
        this.decay = Math.random() * 0.015 + 0.01; // سرعة اختفاء الشعاع
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); // حجم الشعاع
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        // تأثير التوهج (Glow)
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.opacity -= this.decay;
    }
}

// دالة تفجير الألعاب النارية (بشكل شعاعي حقيقي)
function explodeFirework(x, y) {
    const particleCount = 150; // زيادة العدد ليكون "غني" زي الصورة
    const hue = Math.floor(Math.random() * 360);
    const color = `hsl(${hue}, 100%, 60%)`;

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 2; // تفاوت في سرعة الأشعة
        particles.push(new Particle(x, y, color, angle, speed));
    }
}

function animate() {
    // مسح الشاشة مع ترك أثر خفيف جداً للحركة (Trails)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        if (p.opacity > 0) {
            p.update();
            p.draw();
        } else {
            particles.splice(i, 1);
        }
    });
    requestAnimationFrame(animate);
}
animate();

// --- بقية منطق الغرفة والأسئلة (بدون تغيير) ---
function loadQuestion() {
    if(currentQ >= questions.length) { startFinalCelebration(); return; }
    const data = questions[currentQ];
    document.getElementById('questionText').innerText = data.q;
    document.getElementById('progress').innerText = `سؤال ${currentQ + 1} من 5`;
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';
    data.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            if(data.correct === -1 || index === data.correct) {
                // تفجير في نص الشاشة عند الإجابة الصح
                explodeFirework(window.innerWidth/2, window.innerHeight/3);
                if(data.msg) alert(data.msg);
                currentQ++; loadQuestion();
            } else { alert("ركز يا عمنا الإجابة غلط! 😂"); }
        };
        container.appendChild(btn);
    });
}

function startFinalCelebration() {
    document.getElementById('roomScreen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('roomScreen').style.display = 'none';
        document.getElementById('celebrationScreen').style.display = 'grid';
        // إطلاق عشوائي مستمر في النهاية
        setInterval(() => {
            explodeFirework(Math.random() * canvas.width, Math.random() * canvas.height / 2);
        }, 600);
    }, 1000);
}

document.getElementById('lampShade').onclick = () => document.body.classList.toggle('is-on');
loadQuestion();