'use strict';

// CENTRAL DE CONFIGURAÇÕES — edite aqui os preços de referência e o contato.
const CONFIG = {
  whatsapp: '5544991791560',
  threshold: 3000, // valores ACIMA de R$ 3.000 exibem "Consultar com especialista"
  packages: {
    trafego: { label: 'Tráfego pago', price: 1500 },
    trafego_video: { label: 'Tráfego + vídeo', price: 2000 },
    personalizado: { label: 'Plano personalizado', price: null }
  },
  addons: {
    criativos: { label: 'Criativos para anúncios', price: 350 },
    social: { label: 'Social media estratégico', price: 650 },
    edicao: { label: 'Edição de vídeo extra', price: 450 },
    crm: { label: 'Operação e suporte de CRM', price: 690 }
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const formatBRL = amount => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(amount);
const whatsappUrl = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const openWhatsApp = text => window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer');

// Menu responsivo: acessível via teclado, ESC e clique nos links.
const menuToggle = $('#menuToggle');
const mobileMenu = $('#mobileMenu');
function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.hidden = !open;
}
menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
$$('#mobileMenu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
document.addEventListener('click', event => {
  if (menuToggle && mobileMenu && !event.target.closest('.site-header')) setMenu(false);
});
window.addEventListener('resize', () => { if (innerWidth > 860) setMenu(false); });

// Barra de leitura, cabeçalho e ano atual.
const header = $('#header');
const progressBar = $('#scrollIndicator');
let ticking = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  header?.classList.toggle('scrolled', window.scrollY > 20);
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; } }, { passive: true });
updateScroll();
if ($('#year')) $('#year').textContent = String(new Date().getFullYear());

// Animações opcionais: funcionam mesmo se IntersectionObserver não estiver disponível.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: .07 });
  $$('.reveal').forEach(element => observer.observe(element));
} else {
  $$('.reveal').forEach(element => element.classList.add('is-visible'));
}

// Simulador: pacotes são mutuamente exclusivos e adicionais podem ser combinados.
const packageInputs = $$('input[name="package"]');
const addonInputs = $$('input[name="addon"]');
const amount = $('#estimateAmount');
const label = $('#estimateLabel');
const summary = $('#summaryItems');
const specialistNotice = $('#specialistNotice');
const estimateButton = $('#estimateButton');
let currentEstimate = null;

function readEstimate() {
  const key = packageInputs.find(input => input.checked)?.value || 'trafego';
  const base = CONFIG.packages[key];
  const selectedAddons = addonInputs.filter(input => input.checked).map(input => CONFIG.addons[input.value]).filter(Boolean);
  const total = base.price === null ? null : base.price + selectedAddons.reduce((sum, item) => sum + item.price, 0);
  return { base, selectedAddons, total, specialist: total === null || total > CONFIG.threshold };
}
function renderEstimate() {
  if (!amount || !summary || !estimateButton) return;
  const estimate = currentEstimate = readEstimate();
  amount.textContent = '';
  amount.classList.toggle('special', estimate.specialist);
  if (estimate.specialist) {
    amount.textContent = 'Consultar especialista';
    label.textContent = 'Plano personalizado para o seu negócio';
  } else {
    amount.append(document.createTextNode(formatBRL(estimate.total) + ' '));
    const period = document.createElement('small');
    period.textContent = '/mês';
    amount.append(period);
    label.textContent = 'Investimento mensal estimado';
  }
  summary.replaceChildren();
  const items = [{ ...estimate.base }, ...estimate.selectedAddons];
  for (const item of items) {
    const row = document.createElement('li');
    const name = document.createElement('span');
    const price = document.createElement('span');
    name.textContent = item.label;
    price.textContent = item.price === null ? 'A combinar' : formatBRL(item.price);
    row.append(name, price);
    summary.append(row);
  }
  specialistNotice.hidden = !estimate.specialist;
  estimateButton.firstChild.textContent = estimate.specialist ? 'Consultar especialista ' : 'Solicitar proposta ';
}
[...packageInputs, ...addonInputs].forEach(input => input.addEventListener('change', renderEstimate));
$('#resetEstimate')?.addEventListener('click', () => {
  packageInputs.forEach(input => { input.checked = input.value === 'trafego'; });
  addonInputs.forEach(input => { input.checked = false; });
  renderEstimate();
});
estimateButton?.addEventListener('click', event => {
  event.preventDefault();
  const estimate = currentEstimate || readEstimate();
  const services = [estimate.base.label, ...estimate.selectedAddons.map(item => item.label)].join(', ');
  const investment = estimate.specialist ? 'Gostaria de consultar um especialista (plano personalizado ou acima de R$ 3.000/mês).' : `Estimativa do simulador: ${formatBRL(estimate.total)}/mês.`;
  openWhatsApp(`Olá, DŌB! Fiz uma simulação no site.\n\nServiços: ${services}.\n${investment}\n\nQuero conversar sobre uma proposta para meu negócio.`);
});
renderEstimate();

// O formulário apenas prepara uma conversa no WhatsApp. Não há backend nem armazenamento.
const contactForm = $('#contactForm');
contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#contactName').value.trim();
  const service = $('#contactService').value;
  const message = $('#contactMessage').value.trim();
  if (!name || !service || !message || !contactForm.checkValidity()) {
    $('#formError').hidden = false;
    contactForm.reportValidity();
    return;
  }
  $('#formError').hidden = true;
  openWhatsApp(`Olá, DŌB! Vim pelo site e quero conversar sobre um projeto.\n\nNome: ${name}\nInteresse: ${service}\nMinha ideia: ${message}`);
});
