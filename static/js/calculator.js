// EMI Calculator JavaScript

// Global variables
let emiChart = null;
let tenureType = 'years'; // 'years' or 'months'

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    setupEventListeners();
});

// Initialize calculator with default values
function initializeCalculator() {
    calculateAndUpdate();
}

// Setup all event listeners
function setupEventListeners() {
    // Slider inputs
    const loanAmount = document.getElementById('loanAmount');
    const interestRate = document.getElementById('interestRate');
    const loanTenure = document.getElementById('loanTenure');

    loanAmount.addEventListener('input', calculateAndUpdate);
    interestRate.addEventListener('input', calculateAndUpdate);
    loanTenure.addEventListener('input', calculateAndUpdate);

    // Tenure toggle buttons
    const tenureBtns = document.querySelectorAll('.tenure-btn');
    tenureBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            tenureBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Update tenure type
            tenureType = this.dataset.type;

            // Update slider max value and current value
            const tenureSlider = document.getElementById('loanTenure');
            const currentValue = parseInt(tenureSlider.value);

            if (tenureType === 'months') {
                tenureSlider.max = 360; // 30 years in months
                tenureSlider.value = currentValue * 12;
            } else {
                tenureSlider.max = 30;
                tenureSlider.value = Math.round(currentValue / 12);
            }

            calculateAndUpdate();
        });
    });
}

// Main calculation function
function calculateAndUpdate() {
    // Get values
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const annualRate = parseFloat(document.getElementById('interestRate').value);
    const tenure = parseFloat(document.getElementById('loanTenure').value);

    // Calculate tenure in months
    const tenureInMonths = tenureType === 'years' ? tenure * 12 : tenure;

    // Calculate EMI
    const monthlyRate = annualRate / 12 / 100;
    let emi = 0;

    if (monthlyRate === 0) {
        emi = loanAmount / tenureInMonths;
    } else {
        emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths) /
              (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
    }

    // Calculate totals
    const totalPayment = emi * tenureInMonths;
    const totalInterest = totalPayment - loanAmount;

    // Update display values
    updateDisplayValues(loanAmount, annualRate, tenure, emi, totalInterest, totalPayment);

    // Update chart
    updateChart(loanAmount, totalInterest);
}

// Update all display values
function updateDisplayValues(loanAmount, rate, tenure, emi, interest, total) {
    // Update slider labels
    document.getElementById('loanAmountValue').textContent = formatCurrency(loanAmount);
    document.getElementById('interestRateValue').textContent = rate.toFixed(1) + '%';

    const tenureText = tenureType === 'years'
        ? (tenure === 1 ? '1 Year' : tenure + ' Years')
        : (tenure === 1 ? '1 Month' : tenure + ' Months');
    document.getElementById('loanTenureValue').textContent = tenureText;

    // Update result cards
    document.getElementById('emiValue').textContent = formatCurrency(Math.round(emi));
    document.getElementById('principalValue').textContent = formatCurrency(loanAmount);
    document.getElementById('interestValue').textContent = formatCurrency(Math.round(interest));
    document.getElementById('totalValue').textContent = formatCurrency(Math.round(total));
}

// Format number as Indian currency
function formatCurrency(amount) {
    // Convert to string and handle lakhs/crores
    const numStr = Math.round(amount).toString();
    const len = numStr.length;

    if (len <= 3) {
        return '₹' + numStr;
    } else if (len <= 5) {
        return '₹' + numStr.slice(0, len - 3) + ',' + numStr.slice(len - 3);
    } else if (len <= 7) {
        return '₹' + numStr.slice(0, len - 5) + ',' +
               numStr.slice(len - 5, len - 3) + ',' +
               numStr.slice(len - 3);
    } else {
        return '₹' + numStr.slice(0, len - 7) + ',' +
               numStr.slice(len - 7, len - 5) + ',' +
               numStr.slice(len - 5, len - 3) + ',' +
               numStr.slice(len - 3);
    }
}

// Update or create chart
function updateChart(principal, interest) {
    const ctx = document.getElementById('emiChart');

    if (!ctx) return;

    const chartData = {
        labels: ['Principal Amount', 'Total Interest'],
        datasets: [{
            data: [principal, interest],
            backgroundColor: [
                '#2563EB',
                '#4C6FFF'
            ],
            borderWidth: 0
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    font: {
                        family: 'Inter',
                        size: 13
                    },
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: '#111827',
                padding: 12,
                titleFont: {
                    size: 14,
                    family: 'Inter'
                },
                bodyFont: {
                    size: 13,
                    family: 'Inter'
                },
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += formatCurrency(Math.round(context.parsed));
                        return label;
                    }
                }
            }
        }
    };

    if (emiChart) {
        emiChart.data = chartData;
        emiChart.update();
    } else {
        emiChart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: chartOptions
        });
    }
}

// FAQ accordion functionality
function toggleFaq(button) {
    const faqItem = button.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Scroll to calculator function
function scrollToCalculator(type) {
    const calculatorSection = document.getElementById('calculator');

    // Update calculator title based on type
    const titles = {
        'home': 'Home Loan EMI Calculator',
        'car': 'Car Loan EMI Calculator',
        'personal': 'Personal Loan EMI Calculator',
        'business': 'Business Loan EMI Calculator'
    };

    const sectionTitle = calculatorSection.querySelector('.section-title');
    if (sectionTitle && titles[type]) {
        sectionTitle.textContent = titles[type];
    }

    // Scroll to calculator
    calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Optionally update URL without page reload
    if (history.pushState) {
        const newUrl = window.location.protocol + "//" + window.location.host +
                      window.location.pathname + '#calculator';
        window.history.pushState({ path: newUrl }, '', newUrl);
    }
}

// Number formatting utilities
function formatIndianNumber(num) {
    const x = num.toString();
    const lastThree = x.substring(x.length - 3);
    const otherNumbers = x.substring(0, x.length - 3);

    if (otherNumbers !== '') {
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
    } else {
        return lastThree;
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default for links that are just "#"
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Add animation on scroll for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.calculator-card, .benefit-card, .testimonial');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});