document.addEventListener('DOMContentLoaded', () => {

  /*AÑO DINÁMICO EN EL FOOTER*/
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /*HEADER: sombra/borde al hacer scroll*/
  const header = document.getElementById('site-header');
  const onScrollHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /*MENÚ MÓVIL*/
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  const closeMenu = () => {
    navMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cierra el menú al elegir un enlace (comportamiento esperado en mobile)
  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Cierra el menú si se agranda la ventana a escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeMenu();
  });

  /* SCROLL REVEAL (IntersectionObserver)*/
  const revealEls = document.querySelectorAll('.reveal');

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Si el usuario prefiere menos movimiento, mostramos todo directamente
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // se anima una sola vez
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* FORMULARIO DE CONTACTO */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()){
        formStatus.textContent = 'Por favor, Revisa los campos antes de enviar.';
        return;
      }

      formStatus.textContent = 'Enviando Mensaje...';

      const formData = new FormData(contactForm);

      const formspreeEndpoint = 'https://formspree.io/f/xjykrlay';

      try{
        const response = await fetch(formspreeEndpoint,{
          method: 'POST',
          body: formData,
          headers:{
            'Accept': 'application/json' 
          }
        });

        if (response.ok){
          const name = contactForm.querySelector('#name').value.trim();
          formStatus.textContent = `¡Gracias, ${name}! Tu mensaje ha sido enviado correctamente.`;
          contactForm.reset();
        } else {
          const data = await response.json();
          if(Object.hasOwn(data,'errors')){
            formStatus.textContent = data.errors.map(error => error.message).join(', ');
           
        }else{
          formStatus.textContent = 'Ocurrió un problema al enviar el mensaje. Intenta de nuevo.'; 
        }
      }
    } catch (error){
      console.error('Error de envío:',error);
      formStatus.textContent = 'Ocurrió un error de conexión al enviar el formulario.'
    }
  });
}})
