// La altura puede cambiar cuando el menú pasa a una segunda fila en celulares.
const encabezado = document.querySelector('header');
const destinoContacto = document.getElementById('contacto');
const portada = document.getElementById('inicio');

function actualizarAparienciaEncabezado() {
  const sigueEnPortada = portada.getBoundingClientRect().bottom > encabezado.getBoundingClientRect().height;
  encabezado.classList.toggle('sobrePortada', sigueEnPortada);
}

window.addEventListener('scroll', actualizarAparienciaEncabezado, { passive: true });

function actualizarDesplazamientoAnclas() {
  const alturaEncabezado = encabezado.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--alturaEncabezado', `${alturaEncabezado}px`);

  actualizarAparienciaEncabezado();
}

actualizarDesplazamientoAnclas();
const observadorEncabezado = new ResizeObserver(actualizarDesplazamientoAnclas);
observadorEncabezado.observe(encabezado);
observadorEncabezado.observe(destinoContacto.closest('section'));
window.addEventListener('resize', actualizarDesplazamientoAnclas);

// Al abrir una URL con ancla, alineamos después del layout inicial.
window.addEventListener('load', async () => {
  const destinosSecciones = ['#soluciones', '#proceso', '#casos', '#contacto', '#nosotros'];
  if (!destinosSecciones.includes(window.location.hash)) return;

  await document.fonts.ready;
  requestAnimationFrame(() => {
    actualizarDesplazamientoAnclas();
    document.querySelector(window.location.hash).scrollIntoView({
      block: 'start',
      behavior: 'instant',
    });
  });
});

// Ejemplos ilustrativos: no representan proyectos ni resultados de clientes.
const ejemplos = {
  comercio: {
    titulo: '“No sé cuánto stock me queda.”',
    descripcion: 'Las ventas están en un lugar, los pedidos en otro y el inventario en una planilla que siempre queda atrás.',
    resultado: '→ Un sistema que conecta ventas y stock, con avisos para reponer a tiempo.',
  },
  servicios: {
    titulo: '“Pierdo tiempo coordinando turnos.”',
    descripcion: 'Mensajes que se cruzan, horarios anotados a mano y cambios que son difíciles de seguir.',
    resultado: '→ Una agenda online con reservas y recordatorios, adaptada a tu actividad.',
  },
  pyme: {
    titulo: '“Cargamos la misma información varias veces.”',
    descripcion: 'Cada área usa su propia herramienta y actualizar los datos termina siendo un trabajo manual.',
    resultado: '→ Integraciones que conectan tus herramientas y un panel para consultar la información.',
  },
  profesionales: {
    titulo: '“Tengo la información de cada cliente dispersa.”',
    descripcion: 'Entre notas, archivos y mensajes, cuesta seguir cada caso y recordar los próximos pasos.',
    resultado: '→ Un espacio para organizar clientes, documentos y tareas pendientes.',
  },
  emprendedores: {
    titulo: '“Mi emprendimiento crece y no llego a todo.”',
    descripcion: 'Los pedidos llegan por distintos canales y organizar cobros y entregas empieza a llevar demasiado tiempo.',
    resultado: '→ Un panel simple para reunir pedidos, pagos y entregas, y acompañar el crecimiento.',
  },
};

const pestanas = [...document.querySelectorAll('[data-case]')];
const panelEjemplo = document.getElementById('ejemplo');
const tituloEjemplo = document.getElementById('case-title');
const descripcionEjemplo = document.getElementById('case-desc');
const resultadoEjemplo = document.getElementById('case-result');
const grupoEjemplos = panelEjemplo.closest('.demo-section');
const preferenciaMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

// Una ráfaga de la rueda equivale a un módulo, incluso con inercia del trackpad.
// El desplazamiento táctil, el teclado y la barra lateral siguen siendo libres.
const destinosModulos = ['inicio', 'soluciones', 'proceso', 'contacto', 'nosotros']
  .map((identificador) => document.getElementById(identificador));
let navegacionEnCurso = false;
let ultimoGestoRueda = 0;

function obtenerPosicionModulo(destino) {
  if (destino === portada) return 0;
  const compensacion = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  const limite = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(limite, destino.getBoundingClientRect().top + window.scrollY - compensacion));
}

function desplazarAModulo(destino) {
  const posicionDestino = obtenerPosicionModulo(destino);
  const inicioDesplazamiento = performance.now();
  navegacionEnCurso = true;
  history.replaceState(history.state, '', `#${destino.id}`);
  window.scrollTo({
    top: posicionDestino,
    behavior: preferenciaMovimiento.matches ? 'instant' : 'smooth',
  });

  function esperarFinGesto() {
    const tiempoActual = performance.now();
    const terminoDesplazamiento = Math.abs(window.scrollY - posicionDestino) < 2
      || tiempoActual - inicioDesplazamiento > 1800;
    if (terminoDesplazamiento && tiempoActual - ultimoGestoRueda > 240) {
      navegacionEnCurso = false;
      return;
    }
    window.setTimeout(esperarFinGesto, 80);
  }
  esperarFinGesto();
}

function navegarConRueda(evento) {
  if (evento.ctrlKey || evento.metaKey || !evento.deltaY
    || Math.abs(evento.deltaX) > Math.abs(evento.deltaY)
    || evento.target.closest('input, textarea, select, [contenteditable]')) return;

  ultimoGestoRueda = performance.now();
  if (navegacionEnCurso) {
    evento.preventDefault();
    return;
  }

  const posiciones = destinosModulos.map(obtenerPosicionModulo);
  let indiceActual = 0;
  posiciones.forEach((posicion, indice) => {
    if (posicion <= window.scrollY + 4) indiceActual = indice;
  });
  const baja = evento.deltaY > 0;
  const destinoActual = destinosModulos[indiceActual];
  const seccionActual = destinoActual.closest('section');
  const ultimoContenido = seccionActual.lastElementChild.getBoundingClientRect().bottom;
  const alturaDisponible = window.innerHeight
    - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  const alturaContenido = ultimoContenido + window.scrollY
    - (destinoActual.getBoundingClientRect().top + window.scrollY);

  // En pantallas bajas o móviles, permitimos leer todo el módulo antes de avanzar.
  if (baja && (indiceActual === destinosModulos.length - 1
    || (alturaContenido > alturaDisponible && ultimoContenido > window.innerHeight + 4))) return;

  const indiceDestino = baja ? indiceActual + 1
    : (window.scrollY > posiciones[indiceActual] + 4 ? indiceActual : indiceActual - 1);
  if (indiceDestino < 0 || indiceDestino >= destinosModulos.length) return;
  evento.preventDefault();
  desplazarAModulo(destinosModulos[indiceDestino]);
}

window.addEventListener('wheel', navegarConRueda, { passive: false });

// Una copia visual completa el ciclo sin repetir contenido para lectores de pantalla.
const cintaCasos = document.querySelector('.cintaCasos');
const copiaCasos = cintaCasos.querySelector('.grupoCasos').cloneNode(true);
copiaCasos.setAttribute('aria-hidden', 'true');
copiaCasos.inert = true;
cintaCasos.append(copiaCasos);

const intervaloRotacion = 2000;
let ejemplosVisibles = false;
let punteroSobreEjemplos = false;
let focoDentroEjemplos = false;
let temporizadorRotacion;
let animacionEjemplo;

function seleccionarEjemplo(pestanaSeleccionada) {
  pestanas.forEach((pestana) => {
    const estaSeleccionada = pestana === pestanaSeleccionada;
    pestana.setAttribute('aria-selected', estaSeleccionada);
    pestana.tabIndex = estaSeleccionada ? 0 : -1;
  });

  const ejemplo = ejemplos[pestanaSeleccionada.dataset.case];
  tituloEjemplo.textContent = ejemplo.titulo;
  descripcionEjemplo.textContent = ejemplo.descripcion;
  resultadoEjemplo.textContent = ejemplo.resultado;
  panelEjemplo.setAttribute('aria-labelledby', pestanaSeleccionada.id);

  animacionEjemplo?.cancel();
  if (!preferenciaMovimiento.matches) {
    animacionEjemplo = panelEjemplo.animate(
      [{ opacity: .65 }, { opacity: 1 }],
      { duration: 220, easing: 'ease-out' },
    );
  }
  actualizarRotacion();
}

function navegarPestanas(evento, indiceActual) {
  let indiceDestino;

  switch (evento.key) {
    case 'ArrowRight':
      indiceDestino = (indiceActual + 1) % pestanas.length;
      break;
    case 'ArrowLeft':
      indiceDestino = (indiceActual + pestanas.length - 1) % pestanas.length;
      break;
    case 'Home':
      indiceDestino = 0;
      break;
    case 'End':
      indiceDestino = pestanas.length - 1;
      break;
    default:
      return;
  }

  evento.preventDefault();
  seleccionarEjemplo(pestanas[indiceDestino]);
  pestanas[indiceDestino].focus();
}

pestanas.forEach((pestana, indice) => {
  pestana.addEventListener('click', () => seleccionarEjemplo(pestana));
  pestana.addEventListener('keydown', (evento) => navegarPestanas(evento, indice));
});

function actualizarRotacion() {
  window.clearTimeout(temporizadorRotacion);
  const puedeRotar = !preferenciaMovimiento.matches && ejemplosVisibles && !document.hidden
    && !punteroSobreEjemplos && !focoDentroEjemplos;

  panelEjemplo.setAttribute('aria-live', puedeRotar ? 'off' : 'polite');

  if (!puedeRotar) return;

  temporizadorRotacion = window.setTimeout(() => {
    const indiceActual = pestanas.findIndex((pestana) => pestana.getAttribute('aria-selected') === 'true');
    seleccionarEjemplo(pestanas[(indiceActual + 1) % pestanas.length]);
  }, intervaloRotacion);
}

grupoEjemplos.addEventListener('pointerenter', (evento) => {
  if (evento.pointerType !== 'mouse') return;
  punteroSobreEjemplos = true;
  actualizarRotacion();
});

grupoEjemplos.addEventListener('pointerleave', () => {
  punteroSobreEjemplos = false;
  actualizarRotacion();
});

grupoEjemplos.addEventListener('focusin', () => {
  focoDentroEjemplos = true;
  actualizarRotacion();
});

grupoEjemplos.addEventListener('focusout', (evento) => {
  if (grupoEjemplos.contains(evento.relatedTarget)) return;
  focoDentroEjemplos = false;
  actualizarRotacion();
});

document.addEventListener('visibilitychange', actualizarRotacion);
preferenciaMovimiento.addEventListener('change', () => {
  animacionEjemplo?.cancel();
  actualizarRotacion();
});

const observadorRotacion = new IntersectionObserver(([entrada]) => {
  ejemplosVisibles = entrada.isIntersecting && entrada.intersectionRatio >= .25;
  actualizarRotacion();
}, { threshold: [0, .25] });
observadorRotacion.observe(grupoEjemplos);

// Reservar el alto del ejemplo más largo evita que el contenido salte al rotar.
function ajustarAlturaEjemplos() {
  const panelMedicion = panelEjemplo.cloneNode(true);
  panelMedicion.removeAttribute('id');
  panelMedicion.removeAttribute('role');
  panelMedicion.removeAttribute('aria-labelledby');
  panelMedicion.setAttribute('aria-hidden', 'true');
  panelMedicion.inert = true;
  panelMedicion.querySelectorAll('[id]').forEach((elemento) => elemento.removeAttribute('id'));
  panelMedicion.style.cssText = `position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;height:auto;min-height:0;width:${panelEjemplo.getBoundingClientRect().width}px`;
  grupoEjemplos.append(panelMedicion);

  let alturaMaxima = 0;
  Object.values(ejemplos).forEach((ejemplo) => {
    panelMedicion.querySelector('h4').textContent = ejemplo.titulo;
    panelMedicion.querySelector('p').textContent = ejemplo.descripcion;
    panelMedicion.querySelector('.result').textContent = ejemplo.resultado;
    alturaMaxima = Math.max(alturaMaxima, panelMedicion.getBoundingClientRect().height);
  });

  panelMedicion.remove();
  panelEjemplo.style.minHeight = `${Math.ceil(alturaMaxima)}px`;
}

let anchoPanelAnterior = 0;
const observadorAnchoEjemplos = new ResizeObserver(() => {
  const anchoPanel = panelEjemplo.getBoundingClientRect().width;
  if (Math.abs(anchoPanel - anchoPanelAnterior) < .5) return;
  anchoPanelAnterior = anchoPanel;
  ajustarAlturaEjemplos();
});
observadorAnchoEjemplos.observe(panelEjemplo);
document.fonts.ready.then(ajustarAlturaEjemplos);
actualizarRotacion();

const formulario = document.getElementById('brief');
const mensajeConsulta = document.getElementById('mensaje');
const botonCopiar = document.getElementById('copiar');
const estadoConsulta = document.getElementById('status');
const enlaceWhatsapp = document.getElementById('contactoWhatsapp');
const enlaceEmail = document.getElementById('contactoEmail');
const canalWhatsapp = enlaceWhatsapp.href;
const canalEmail = enlaceEmail.href;

function abrirCanalConsulta(destino) {
  if (destino.startsWith('mailto:')) {
    window.location.assign(destino);
    return;
  }
  window.open(destino, '_blank', 'noopener,noreferrer');
}

// Preparamos el mensaje y abrimos el canal. El envío se confirma en su aplicación.
function prepararConsulta(evento) {
  evento.preventDefault();

  const datosFormulario = new FormData(formulario);
  mensajeConsulta.value = `Hola, soy ${datosFormulario.get('nombre')}.\nMi negocio: ${datosFormulario.get('negocio')}.\nQuiero: ${datosFormulario.get('objetivo')}.\n\n${datosFormulario.get('detalle')}`;
  mensajeConsulta.hidden = false;
  botonCopiar.hidden = false;
  const mensajeCodificado = encodeURIComponent(mensajeConsulta.value);
  enlaceWhatsapp.href = `${canalWhatsapp}?text=${mensajeCodificado}`;
  enlaceEmail.href = `${canalEmail}?subject=${encodeURIComponent("Consulta para Comodoro Dev's")}&body=${mensajeCodificado}`;
  const usarCorreo = evento.submitter?.value === 'email';
  estadoConsulta.textContent = usarCorreo
    ? 'Tu consulta está lista para abrir en tu aplicación de correo. Confirmá el envío allí. Si no se abre, podés copiar el mensaje.'
    : 'Tu consulta está lista para abrir en WhatsApp. Confirmá el envío allí. Si no se abre, podés copiar el mensaje.';
  abrirCanalConsulta(usarCorreo ? enlaceEmail.href : enlaceWhatsapp.href);
}

async function copiarConsulta() {
  try {
    await navigator.clipboard.writeText(mensajeConsulta.value);
    estadoConsulta.textContent = 'Consulta copiada. Lista para compartir por el canal que prefieras.';
  } catch {
    mensajeConsulta.focus();
    mensajeConsulta.select();
    estadoConsulta.textContent = 'Seleccionamos el mensaje. Usá Ctrl+C o la opción Copiar de tu dispositivo.';
  }
}

formulario.addEventListener('submit', prepararConsulta);
botonCopiar.addEventListener('click', copiarConsulta);
