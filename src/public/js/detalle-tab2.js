const PERSONAS    = window.TAB2_PERSONAS    || [];
const CELEBRANTES = window.TAB2_CELEBRANTES || [];

const rolExistente    = document.getElementById("rolExistente");
const inputBusqueda   = document.getElementById("inputBusqueda");
const listaResultados = document.getElementById("listaResultados");
const tarjetaPerfil   = document.getElementById("tarjetaPerfil");
const cuerpoPerfil    = document.getElementById("cuerpoPerfil");
const btnGuardar      = document.getElementById("btnGuardar");

let personaSeleccionada = null;
let listActual = [];

// Oculta la tarjeta de perfil y desactiva el botón Guardar
const ocultarPerfil = () => {
  tarjetaPerfil.classList.add("d-none");
  btnGuardar.disabled = true;
};

// Al cambiar el rol, actualiza la lista activa y limpia el buscador
rolExistente.addEventListener("change", function() {
  listActual = this.value === "Celebrante" ? CELEBRANTES : PERSONAS;
  inputBusqueda.value = "";
  listaResultados.innerHTML = "";
  personaSeleccionada = null;
  ocultarPerfil();
});

// Al escribir en el buscador, filtra la lista activa y muestra los resultados
inputBusqueda.addEventListener("input", function() {
  listaResultados.innerHTML = "";
  personaSeleccionada = null;
  ocultarPerfil();

  if (!rolExistente.value) {
    listaResultados.innerHTML = '<div class="list-group-item text-muted">Selecciona un rol primero.</div>';
    return;
  }

  const texto = this.value.trim().toLowerCase();
  if (!texto) return;

  const resultados = listActual.filter(p => p.nombre.toLowerCase().includes(texto));

  if (resultados.length === 0) {
    listaResultados.innerHTML = '<div class="list-group-item text-muted">Sin resultados.</div>';
    return;
  }

  resultados.forEach(persona => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "list-group-item list-group-item-action";
    btn.textContent = persona.nombre;
    btn.onclick = () => elegir(persona, btn);
    listaResultados.appendChild(btn);
  });
});

// Marca una persona como seleccionada y consulta su perfil al servidor
const elegir = (persona, btnClickeado) => {
  personaSeleccionada = persona;
  btnGuardar.disabled = false;

  Array.from(listaResultados.children).forEach(b => b.classList.remove("active"));
  btnClickeado.classList.add("active");

  tarjetaPerfil.classList.remove("d-none");
  cuerpoPerfil.innerHTML = `
    <strong>${persona.nombre}</strong>
    <div class="text-muted mt-2">
      <span class="spinner-border spinner-border-sm"></span> Cargando participaciones…
    </div>`;

  fetch(`/web/personas/${persona.id}/perfil-participante`)
    .then(response => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(perfil => {
      if (personaSeleccionada !== persona) return;
      mostrarPerfil(persona, perfil);
    })
    .catch(() => {
      if (personaSeleccionada !== persona) return;
      cuerpoPerfil.innerHTML = `
        <strong>${persona.nombre}</strong>
        <div class="text-danger mt-2 small">No se pudo cargar el perfil.</div>`;
    });
};

// Renderiza el perfil de la persona seleccionada en la tarjeta
const mostrarPerfil = (persona, perfil) => {
  const partes = perfil.participaciones || [];
  let html = `<strong>${persona.nombre}</strong>`;

  if (perfil.rut && perfil.rut !== "—") {
    html += `<div class="text-muted small mt-1">RUT: ${perfil.rut}`;
    if (perfil.nac && perfil.nac !== "—") html += ` · Nac: ${perfil.nac}`;
    html += `</div>`;
  }

  if (partes.length === 0) {
    html += `<div class="text-muted mt-2">Sin participaciones previas.</div>`;
  } else {
    html += `<div class="mt-2">Participaciones previas:</div><ul class="mb-0 mt-1">`;
    partes.forEach(t => {
      html += `<li><a href="/web/tramites/${t.tramite}" target="_blank">Trámite #${t.tramite}</a> — ${t.rol} · ${t.detalle} (${t.fecha})</li>`;
    });
    html += `</ul>`;
  }

  cuerpoPerfil.innerHTML = html;
};

// Al enviar el formulario, asigna el ID al campo oculto y hace submit manual
document.getElementById("formExistente").addEventListener("submit", function(e) {
  e.preventDefault();
  if (!personaSeleccionada) return;
  document.getElementById("personaIdHidden").value = personaSeleccionada.id;
  this.submit();
});

// Resetea el tab a su estado inicial — llamado desde detalle.js al cerrar el modal
window.tab2Reset = () => {
  rolExistente.value = "";
  inputBusqueda.value = "";
  listaResultados.innerHTML = "";
  personaSeleccionada = null;
  listActual = [];
  ocultarPerfil();
};
