// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === Forex Simulation Logic ===
function initForexSimulation() {
    const pairs = [
        { id: 'fx-usdjpy', base: 150.500, volatility: 0.05, spread: 0.015, tpRatio: 2, slRisk: 0.2 },
        { id: 'fx-eurjpy', base: 163.200, volatility: 0.06, spread: 0.020, tpRatio: 2, slRisk: 0.25 }
    ];

    pairs.forEach(pair => {
        const card = document.getElementById(pair.id);
        if (!card) return;

        const priceEl = card.querySelector('.current-price');
        const tpEl = card.querySelector('.tp-value');
        const slEl = card.querySelector('.sl-value');
        
        let currentPrice = pair.base;

        // Function to update TP/SL based on current price
        const updateTradeLevels = (price) => {
            // Assume we are doing a trend follow (Long position for demo purposes)
            // If we risk 'slRisk' yen, our Take profit is 'slRisk * tpRatio' yen
            const slPrice = price - pair.slRisk;
            const tpPrice = price + (pair.slRisk * pair.tpRatio);

            tpEl.textContent = `¥${tpPrice.toFixed(3)}`;
            slEl.textContent = `¥${slPrice.toFixed(3)}`;
        };

        // Initial setup
        updateTradeLevels(currentPrice);

        // Tick every 1000ms
        setInterval(() => {
            // Random noise calculation
            const change = (Math.random() - 0.5) * pair.volatility;
            const newPrice = currentPrice + change;
            
            priceEl.textContent = newPrice.toFixed(3);

            // Add color flash effect
            card.classList.remove('tick-up', 'tick-down');
            // trigger reflow to reset animation
            void card.offsetWidth; 
            
            if (newPrice > currentPrice) {
                card.classList.add('tick-up');
                card.querySelector('.status').textContent = 'Live ↑';
                card.querySelector('.status').style.color = '#10b981';
            } else {
                card.classList.add('tick-down');
                card.querySelector('.status').textContent = 'Live ↓';
                card.querySelector('.status').style.color = '#ef4444';
            }

            currentPrice = newPrice;
            
            // Recalculate dynamic SL/TP slightly delayed or continuously
            updateTradeLevels(currentPrice);

        }, 1000); // Update every second
    });
}

// Start simulation after DOM load
document.addEventListener('DOMContentLoaded', initForexSimulation);
