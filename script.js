// La altura puede cambiar cuando el menú pasa a una segunda fila en celulares.
const encabezado = document.querySelector('header');
const destinoContacto = document.getElementById('contacto');

function actualizarDesplazamientoAnclas() {
  const alturaEncabezado = encabezado.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--alturaEncabezado', `${alturaEncabezado}px`);

  // Contacto también necesita espacio suficiente al final para poder alinearse.
  const espacioFinalActual = parseFloat(getComputedStyle(document.body).paddingBottom);
  const alturaContenido = document.documentElement.scrollHeight - espacioFinalActual;
  const posicionContacto = destinoContacto.getBoundingClientRect().top + window.scrollY;
  const desplazamientoAnclas = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  const espacioFinalNecesario = Math.max(
    0,
    Math.ceil(window.innerHeight - desplazamientoAnclas - (alturaContenido - posicionContacto)),
  );
  document.documentElement.style.setProperty('--espacioFinalAnclas', `${espacioFinalNecesario}px`);
}

actualizarDesplazamientoAnclas();
const observadorEncabezado = new ResizeObserver(actualizarDesplazamientoAnclas);
observadorEncabezado.observe(encabezado);
observadorEncabezado.observe(destinoContacto.closest('section'));
window.addEventListener('resize', actualizarDesplazamientoAnclas);

// Al abrir una URL con ancla, alineamos después del layout inicial.
window.addEventListener('load', async () => {
  const destinosSecciones = ['#soluciones', '#proceso', '#contacto'];
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
};

const pestanas = [...document.querySelectorAll('[data-case]')];
const panelEjemplo = document.getElementById('ejemplo');
const tituloEjemplo = document.getElementById('case-title');
const descripcionEjemplo = document.getElementById('case-desc');
const resultadoEjemplo = document.getElementById('case-result');

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

const formulario = document.getElementById('brief');
const mensajeConsulta = document.getElementById('mensaje');
const botonCopiar = document.getElementById('copiar');
const estadoConsulta = document.getElementById('status');
const enlaceWhatsapp = document.getElementById('contactoWhatsapp');
const enlaceEmail = document.getElementById('contactoEmail');
const canalWhatsapp = enlaceWhatsapp.href;
const canalEmail = enlaceEmail.href;

// Solo preparamos el mensaje. No enviamos ni guardamos consultas.
function prepararConsulta(evento) {
  evento.preventDefault();

  const datosFormulario = new FormData(formulario);
  mensajeConsulta.value = `Hola, soy ${datosFormulario.get('nombre')}.\nMi negocio: ${datosFormulario.get('negocio')}.\nQuiero: ${datosFormulario.get('objetivo')}.\n\n${datosFormulario.get('detalle')}`;
  mensajeConsulta.hidden = false;
  botonCopiar.hidden = false;
  const mensajeCodificado = encodeURIComponent(mensajeConsulta.value);
  enlaceWhatsapp.href = `${canalWhatsapp}?text=${mensajeCodificado}`;
  enlaceEmail.href = `${canalEmail}?subject=${encodeURIComponent("Consulta para Comodoro Dev's")}&body=${mensajeCodificado}`;
  estadoConsulta.textContent = 'Tu consulta está lista. Podés copiarla; todavía no se envió.';
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
