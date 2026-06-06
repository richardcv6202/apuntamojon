// ========== FUNCIÓN AUXILIAR PARA FORMATEAR FECHAS ==========
function formatearFecha(fechaISO) {
  if (!fechaISO) return '';
  const partes = fechaISO.split('-');
  if (partes.length !== 3) return fechaISO;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// ========== ESTADO GLOBAL ==========
let jugadores = [];
let partidaActiva = false;
let manosPartida = [];
let fechaPartida = new Date().toISOString().split('T')[0];

// ========== ELEMENTOS DOM ==========
const numJugadoresSelect = document.getElementById('numJugadores');
const nombresContainer = document.getElementById('nombresJugadores');
const btnIniciar = document.getElementById('btnIniciarPartida');
const btnCancelar = document.getElementById('btnCancelarPartida');
const btnAnotacion = document.getElementById('btnAnotacion');
const btnEstadisticas = document.getElementById('btnEstadisticas');
const btnImportExport = document.getElementById('btnImportExport');
const btnAyuda = document.getElementById('btnAyuda');

// ========== MODALES ==========
const modalAnotacion = document.getElementById('modalAnotacion');
const modalEstadisticas = document.getElementById('modalEstadisticas');
const modalImportExport = document.getElementById('modalImportExport');
const modalFinal = document.getElementById('modalFinal');
const modalMensaje = document.getElementById('modalMensaje');
const modalConfirmacion = document.getElementById('modalConfirmacion');
const modalPassword = document.getElementById('modalPassword');

// ========== FUNCIONES DE MODALES ==========
function mostrarMensaje(titulo, texto, icono = '⚠️') {
  document.getElementById('mensajeTitulo').textContent = titulo;
  document.getElementById('mensajeTexto').textContent = texto;
  document.getElementById('mensajeIcono').textContent = icono;
  modalMensaje.style.display = 'flex';
}

function mostrarMensajeFinal(mensaje) {
  document.getElementById('mensajeFinal').innerHTML = mensaje;
  modalFinal.style.display = 'flex';
}

function mostrarConfirmacion(texto, onConfirm) {
  document.getElementById('confirmacionTexto').textContent = texto;
  modalConfirmacion.style.display = 'flex';
  
  const btnSi = document.getElementById('btnConfirmarSi');
  const btnNo = document.getElementById('btnConfirmarNo');
  
  const handlerSi = () => {
    modalConfirmacion.style.display = 'none';
    onConfirm();
    btnSi.removeEventListener('click', handlerSi);
    btnNo.removeEventListener('click', handlerNo);
  };
  
  const handlerNo = () => {
    modalConfirmacion.style.display = 'none';
    btnSi.removeEventListener('click', handlerSi);
    btnNo.removeEventListener('click', handlerNo);
  };
  
  btnSi.removeEventListener('click', handlerSi);
  btnNo.removeEventListener('click', handlerNo);
  btnSi.addEventListener('click', handlerSi);
  btnNo.addEventListener('click', handlerNo);
}

document.getElementById('btnCerrarMensaje').onclick = () => {
  modalMensaje.style.display = 'none';
};

// ========== LÓGICA DE MOJÓN ==========
function calcularPalabra(perdidas) {
  if (perdidas === 0) return "";
  if (perdidas === 1) return "M";
  if (perdidas === 2) return "MO";
  if (perdidas === 3) return "MOJ";
  if (perdidas === 4) return "MOJO";
  if (perdidas === 5) return "MOJÓ";
  if (perdidas >= 6) return "MOJÓN";
  return "";
}

function calcularLetrasGanadas(tantos) {
  if (tantos < 26) return 1;
  if (tantos < 51) return 2;
  if (tantos < 76) return 3;
  if (tantos < 101) return 4;
  if (tantos < 126) return 5;
  return 6;
}

function actualizarProgresoUI() {
  if (!partidaActiva || jugadores.length === 0) return;
  
  jugadores.forEach((jugador, idx) => {
    const progresoDiv = document.getElementById(`progreso-${idx}`);
    if (progresoDiv) {
      const palabraMostrar = jugador.palabra || "⚪";
      const letrasMostrar = jugador.perdidas;
      progresoDiv.innerHTML = `
        <span>📜 Progreso:</span>
        <span class="palabra-mojon">${palabraMostrar}</span>
        <span class="perdidas-num">${letrasMostrar}/6</span>
      `;
    }
  });
}

function mostrarCamposNombres() {
  const num = parseInt(numJugadoresSelect.value);
  
  if (nombresContainer.children.length === 0) {
    for (let i = 1; i <= 4; i++) {
      const card = document.createElement('div');
      card.className = 'jugador-card';
      card.id = `jugadorCard-${i}`;
      card.innerHTML = `
        <div class="nombre-field">
          <label>Jugador ${i}:</label>
          <input type="text" id="nombreJugador${i}" placeholder="Nombre del jugador ${i}">
        </div>
        <div class="progreso-individual" id="progreso-${i-1}">
          <span>📜 Progreso:</span>
          <span class="palabra-mojon">⚪</span>
          <span class="perdidas-num">0/6</span>
        </div>
      `;
      nombresContainer.appendChild(card);
    }
  }
  
  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`nombreJugador${i}`);
    const card = document.getElementById(`jugadorCard-${i}`);
    if (i <= num) {
      input.disabled = false;
      card.style.opacity = '1';
      card.style.filter = 'none';
    } else {
      input.disabled = true;
      input.value = '';
      card.style.opacity = '0.5';
      card.style.filter = 'grayscale(0.3)';
    }
  }
}

function obtenerNombres() {
  const num = parseInt(numJugadoresSelect.value);
  const nombres = [];
  
  if (num < 2) {
    mostrarMensaje('Configuración inválida', 'Debe haber al menos 2 jugadores para jugar', '⚠️');
    return null;
  }
  
  for (let i = 1; i <= num; i++) {
    const input = document.getElementById(`nombreJugador${i}`);
    if (!input || !input.value.trim()) {
      mostrarMensaje('Faltan nombres', `Debe escribir el nombre del Jugador ${i}`, '⚠️');
      return null;
    }
    nombres.push(input.value.trim());
  }
  
  return nombres;
}

function iniciarPartida() {
  const nombres = obtenerNombres();
  if (!nombres) return;
  
  jugadores = nombres.map(nombre => ({
    nombre: nombre,
    perdidas: 0,
    palabra: ""
  }));
  
  partidaActiva = true;
  manosPartida = [];
  
  const hoy = new Date();
  fechaPartida = hoy.toISOString().split('T')[0];
  
  actualizarProgresoUI();
  btnAnotacion.disabled = false;
  btnCancelar.disabled = false;
  btnIniciar.disabled = true;
  numJugadoresSelect.disabled = true;
  
  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`nombreJugador${i}`);
    if (input) input.disabled = true;
  }
  
  guardarEstadoLocal();
}

function cancelarPartida() {
  mostrarConfirmacion('¿Cancelar partida actual? Se perderá todo el progreso.', () => {
    partidaActiva = false;
    jugadores = [];
    manosPartida = [];
    btnAnotacion.disabled = true;
    btnCancelar.disabled = true;
    btnIniciar.disabled = false;
    numJugadoresSelect.disabled = false;
    localStorage.removeItem('mojon_partidaActiva');
    
    for (let i = 0; i < 4; i++) {
      const prog = document.getElementById(`progreso-${i}`);
      if (prog) {
        prog.innerHTML = `<span>📜 Progreso:</span><span class="palabra-mojon">⚪</span><span class="perdidas-num">0/6</span>`;
      }
    }
    
    const num = parseInt(numJugadoresSelect.value);
    for (let i = 1; i <= 4; i++) {
      const input = document.getElementById(`nombreJugador${i}`);
      if (input) {
        input.value = '';
        if (i <= num) {
          input.disabled = false;
        } else {
          input.disabled = true;
          const card = document.getElementById(`jugadorCard-${i}`);
          if (card) {
            card.style.opacity = '0.5';
            card.style.filter = 'grayscale(0.3)';
          }
        }
      }
    }
    
    mostrarMensaje('Partida cancelada', 'La partida ha sido cancelada correctamente.', '✅');
  });
}

function guardarEstadoLocal() {
  const estado = {
    jugadores,
    partidaActiva,
    manosPartida,
    fechaPartida
  };
  localStorage.setItem('mojon_partidaActiva', JSON.stringify(estado));
}

function cargarEstadoLocal() {
  const raw = localStorage.getItem('mojon_partidaActiva');
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (data.partidaActiva) {
        jugadores = data.jugadores;
        partidaActiva = true;
        manosPartida = data.manosPartida || [];
        fechaPartida = data.fechaPartida;
        
        const num = jugadores.length;
        numJugadoresSelect.value = num;
        numJugadoresSelect.disabled = true;
        
        mostrarCamposNombres();
        
        for (let i = 1; i <= 4; i++) {
          const input = document.getElementById(`nombreJugador${i}`);
          const card = document.getElementById(`jugadorCard-${i}`);
          if (i <= num) {
            input.value = jugadores[i-1].nombre;
            input.disabled = true;
            card.style.opacity = '1';
            card.style.filter = 'none';
          } else {
            input.value = '';
            input.disabled = true;
            card.style.opacity = '0.5';
            card.style.filter = 'grayscale(0.3)';
          }
        }
        
        actualizarProgresoUI();
        btnAnotacion.disabled = false;
        btnCancelar.disabled = false;
        btnIniciar.disabled = true;
      }
    } catch(e) {
      console.error('Error al cargar partida:', e);
    }
  }
}

// ========== ANOTACIÓN DE MANOS ==========
function abrirModalAnotacion() {
  if (!partidaActiva) {
    mostrarMensaje('Sin partida activa', 'Primero inicia una partida para poder anotar.', '🎲');
    return;
  }
  
  const listaCierreDiv = document.getElementById('listaCierre');
  const listaPerdedoresDiv = document.getElementById('listaPerdedores');
  const chkPegue = document.getElementById('tipoPegue');
  
  listaCierreDiv.innerHTML = '';
  jugadores.forEach((j, idx) => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="cerrador" value="${j.nombre}" ${idx === 0 ? 'checked' : ''}> ${j.nombre}`;
    listaCierreDiv.appendChild(label);
  });
  
  const actualizarListaPerdedores = () => {
    const esPegue = chkPegue.checked;
    const cerradorSeleccionado = document.querySelector('input[name="cerrador"]:checked')?.value;
    
    listaPerdedoresDiv.innerHTML = '';
    jugadores.forEach(j => {
      const disabled = esPegue && j.nombre === cerradorSeleccionado;
      const label = document.createElement('label');
      label.style.opacity = disabled ? '0.5' : '1';
      label.innerHTML = `<input type="checkbox" name="perdedor" value="${j.nombre}" ${disabled ? 'disabled' : ''}> ${j.nombre}`;
      listaPerdedoresDiv.appendChild(label);
    });
  };
  
  chkPegue.addEventListener('change', actualizarListaPerdedores);
  const radioListener = () => actualizarListaPerdedores();
  listaCierreDiv.querySelectorAll('input[name="cerrador"]').forEach(radio => {
    radio.addEventListener('change', radioListener);
  });
  
  actualizarListaPerdedores();
  chkPegue.checked = false;
  document.getElementById('tantosInput').value = '';
  
  modalAnotacion.style.display = 'flex';
}

function aceptarAnotacion() {
  if (!partidaActiva) {
    mostrarMensaje('Error', 'No hay partida activa', '❌');
    modalAnotacion.style.display = 'none';
    return;
  }
  
  const esPegue = document.getElementById('tipoPegue').checked;
  
  const radioSel = document.querySelector('input[name="cerrador"]:checked');
  if (!radioSel) {
    mostrarMensaje('Falta selección', 'Selecciona quién cerró o pegó la mano', '🎯');
    return;
  }
  const cerrador = radioSel.value;
  
  const checkPerdedores = document.querySelectorAll('input[name="perdedor"]:checked:not(:disabled)');
  if (checkPerdedores.length === 0) {
    mostrarMensaje('Falta selección', 'Selecciona al menos un perdedor', '💀');
    return;
  }
  const perdedores = Array.from(checkPerdedores).map(cb => cb.value);
  
  const tantos = parseInt(document.getElementById('tantosInput').value);
  if (isNaN(tantos) || tantos < 0) {
    mostrarMensaje('Valor inválido', 'Ingresa una cantidad de tantos válida', '🔢');
    return;
  }
  
  const letrasAAñadir = calcularLetrasGanadas(tantos);
  
  let partidaTerminada = false;
  let perdedorFinal = null;
  
  perdedores.forEach(nombre => {
    const jugador = jugadores.find(j => j.nombre === nombre);
    if (!jugador) return;
    
    jugador.perdidas += letrasAAñadir;
    if (jugador.perdidas > 6) jugador.perdidas = 6;
    jugador.palabra = calcularPalabra(jugador.perdidas);
    
    if (jugador.perdidas >= 6 || jugador.palabra === "MOJÓN") {
      partidaTerminada = true;
      perdedorFinal = nombre;
    }
  });
  
  manosPartida.push({
    tipo: esPegue ? 'pegue' : 'cierre',
    cerrador,
    perdedores,
    tantos,
    letrasAsignadas: letrasAAñadir,
    timestamp: Date.now()
  });
  
  actualizarProgresoUI();
  guardarEstadoLocal();
  modalAnotacion.style.display = 'none';
  
  if (partidaTerminada) {
    finalizarPartida(perdedorFinal);
  }
}

function finalizarPartida(perdedorNombre) {
  guardarPartidaEnBD(perdedorNombre);
  
  mostrarMensajeFinal(`${perdedorNombre} se ha comido un mojón 💩`);
  
  jugadores.forEach(j => {
    j.perdidas = 0;
    j.palabra = "";
  });
  manosPartida = [];
  actualizarProgresoUI();
  guardarEstadoLocal();
}

function cerrarModalFinal() {
  modalFinal.style.display = 'none';
}

// ========== BASE DE DATOS ==========
function cargarBD() {
  const data = localStorage.getItem('mojon_bd');
  if (data) return JSON.parse(data);
  return { version: '2.0', partidas: [], estadisticasJugador: {} };
}

function guardarBD(bd) {
  localStorage.setItem('mojon_bd', JSON.stringify(bd));
}

function guardarPartidaEnBD(perdedorFinal) {
  const bd = cargarBD();
  const nuevaPartida = {
    id: Date.now(),
    fecha: fechaPartida,
    manos: manosPartida,
    resultadoFinal: {
      perdedorPartida: perdedorFinal,
      manosTotales: manosPartida.length
    }
  };
  bd.partidas.push(nuevaPartida);
  
  if (!bd.estadisticasJugador) bd.estadisticasJugador = {};
  
  const jugadoresNombres = jugadores.map(j => j.nombre);
  jugadoresNombres.forEach(nom => {
    if (!bd.estadisticasJugador[nom]) {
      bd.estadisticasJugador[nom] = {
        partidasJugadas: 0,
        vecesMojon: 0,
        maxTantos: 0,
        minTantos: 0,
        totalLetrasAcumuladas: 0,
        vecesCierre: 0,
        vecesPegue: 0,
        manosTotales: 0
      };
    }
    const est = bd.estadisticasJugador[nom];
    est.partidasJugadas++;
    
    const manosJugador = manosPartida.filter(m => m.perdedores.includes(nom) || m.cerrador === nom);
    est.manosTotales += manosJugador.length;
    
    const tantosEnEstaPartida = manosPartida.filter(m => m.perdedores.includes(nom)).map(m => m.tantos);
    tantosEnEstaPartida.forEach(t => {
      if (t > est.maxTantos) est.maxTantos = t;
      if (est.minTantos === 0 || t < est.minTantos) est.minTantos = t;
    });
    
    const letrasPerdidas = manosPartida.filter(m => m.perdedores.includes(nom)).reduce((sum, m) => sum + m.letrasAsignadas, 0);
    est.totalLetrasAcumuladas += letrasPerdidas;
    
    if (manosPartida.some(m => m.cerrador === nom && m.tipo === 'cierre')) est.vecesCierre++;
    if (manosPartida.some(m => m.cerrador === nom && m.tipo === 'pegue')) est.vecesPegue++;
  });
  
  if (perdedorFinal && bd.estadisticasJugador[perdedorFinal]) {
    bd.estadisticasJugador[perdedorFinal].vecesMojon++;
  }
  
  guardarBD(bd);
  actualizarTablasEstadisticas();
}

// ========== ESTADÍSTICAS ==========
function actualizarTablasEstadisticas() {
  const bd = cargarBD();
  const hoyISO = new Date().toISOString().split('T')[0];
  const hoyFormateado = formatearFecha(hoyISO);
  const partidasHoy = bd.partidas.filter(p => p.fecha === hoyISO);
  
  document.getElementById('fechaActual').innerText = hoyFormateado;
  
  // Tabla diaria
  const statsHoy = {};
  partidasHoy.forEach(p => {
    const perdedor = p.resultadoFinal.perdedorPartida;
    if (!statsHoy[perdedor]) {
      statsHoy[perdedor] = { partidas: 0, mojones: 0, maxTantos: 0 };
    }
    statsHoy[perdedor].partidas++;
    statsHoy[perdedor].mojones++;
    
    const tantosDelPerdedor = p.manos
      .filter(m => m.perdedores && m.perdedores.includes(perdedor))
      .map(m => m.tantos);
    const maxTanto = Math.max(...tantosDelPerdedor, 0);
    if (maxTanto > statsHoy[perdedor].maxTantos) {
      statsHoy[perdedor].maxTantos = maxTanto;
    }
  });
  
  const rankingHoy = Object.keys(statsHoy).map(nombre => ({
    nombre: nombre,
    partidas: statsHoy[nombre].partidas,
    mojones: statsHoy[nombre].mojones,
    maxTantos: statsHoy[nombre].maxTantos
  })).sort((a, b) => b.mojones - a.mojones || b.maxTantos - a.maxTantos);
  
  let diarioHtml = '';
  if (rankingHoy.length === 0) {
    diarioHtml = '<div class="stats-empty">📭 No hay partidas registradas hoy</div>';
  } else {
    diarioHtml = '<div class="stats-table-container"><table class="stats-table"><thead><tr><th>Jugador</th><th>Partidas</th><th>Mojones</th><th>+Gorda</th></tr></thead><tbody>';
    rankingHoy.forEach(r => {
      diarioHtml += '<tr>';
      diarioHtml += '<td>' + (r.nombre || '?') + '</td>';
      diarioHtml += '<td>' + (r.partidas || 0) + '</td>';
      diarioHtml += '<td>' + (r.mojones || 0) + '</td>';
      diarioHtml += '<td>' + (r.maxTantos || 0) + '</td>';
      diarioHtml += '</tr>';
    });
    diarioHtml += '</tbody></table></div>';
  }
  document.getElementById('statsDiario').innerHTML = diarioHtml;
  
  // Días anteriores
  const diasMap = {};
  bd.partidas.forEach(p => {
    if (p.fecha !== hoyISO) {
      if (!diasMap[p.fecha]) diasMap[p.fecha] = [];
      diasMap[p.fecha].push(p);
    }
  });
  
  let diasHtml = '';
  if (Object.keys(diasMap).length === 0) {
    diasHtml = '<div class="stats-empty">📭 No hay partidas de días anteriores</div>';
  } else {
    const fechasOrdenadas = Object.keys(diasMap).sort().reverse();
    for (const fechaISO of fechasOrdenadas) {
      const fechaFormateada = formatearFecha(fechaISO);
      const partidas = diasMap[fechaISO];
      diasHtml += '<div class="fecha-grupo">📅 ' + fechaFormateada + '</div>';
      diasHtml += '<div class="stats-table-container"><table class="stats-table"><thead><tr><th>Jugador</th><th>Manos</th><th>Mojones</th><th>+Gorda</th></tr></thead><tbody>';
      
      const statsFecha = {};
      partidas.forEach(p => {
        const perdedor = p.resultadoFinal.perdedorPartida;
        if (!statsFecha[perdedor]) {
          statsFecha[perdedor] = { manos: 0, mojones: 0, maxTantos: 0 };
        }
        statsFecha[perdedor].manos += p.resultadoFinal.manosTotales;
        statsFecha[perdedor].mojones++;
        
        const tantosDelPerdedor = p.manos
          .filter(m => m.perdedores && m.perdedores.includes(perdedor))
          .map(m => m.tantos);
        const maxTanto = Math.max(...tantosDelPerdedor, 0);
        if (maxTanto > statsFecha[perdedor].maxTantos) {
          statsFecha[perdedor].maxTantos = maxTanto;
        }
      });
      
      const rankingFecha = Object.keys(statsFecha).map(nombre => ({
        nombre: nombre,
        manos: statsFecha[nombre].manos,
        mojones: statsFecha[nombre].mojones,
        maxTantos: statsFecha[nombre].maxTantos
      })).sort((a, b) => b.mojones - a.mojones || b.maxTantos - a.maxTantos);
      
      for (const r of rankingFecha) {
        diasHtml += '<tr>';
        diasHtml += '<td>' + (r.nombre || '?') + '</td>';
        diasHtml += '<td>' + (r.manos || 0) + '</td>';
        diasHtml += '<td>' + (r.mojones || 0) + '</td>';
        diasHtml += '<td>' + (r.maxTantos || 0) + '</td>';
        diasHtml += '</tr>';
      }
      diasHtml += '</tbody></table></div>';
    }
  }
  document.getElementById('statsDiasAnteriores').innerHTML = diasHtml;
  
  // Ranking global
  const rankingGlobal = Object.keys(bd.estadisticasJugador).map(nombre => {
    const s = bd.estadisticasJugador[nombre];
    const porcentaje = s.partidasJugadas > 0 ? ((s.vecesMojon / s.partidasJugadas) * 100).toFixed(1) : 0;
    return {
      nombre: nombre,
      partidas: s.partidasJugadas || 0,
      manosTotales: s.manosTotales || 0,
      mojones: s.vecesMojon || 0,
      porcentaje: porcentaje,
      maxTantos: s.maxTantos || 0,
      cierres: s.vecesCierre || 0,
      pegues: s.vecesPegue || 0
    };
  }).sort((a, b) => b.mojones - a.mojones || b.maxTantos - a.maxTantos);
  
  let globalHtml = '<div class="stats-table-container"><table class="stats-table"><thead>一面<th>Jugador</th><th>Partidas</th><th>Manos</th><th>Mojones</th><th>% Mojón</th><th>+Gorda</th><th>Cierres</th><th>Pegues</th></tr></thead><tbody>';
  for (const r of rankingGlobal) {
    globalHtml += '<tr>';
    globalHtml += '<td>' + (r.nombre || '?') + '</td>';
    globalHtml += '<td>' + r.partidas + '</td>';
    globalHtml += '<td>' + r.manosTotales + '</td>';
    globalHtml += '<td>' + r.mojones + '</td>';
    globalHtml += '<td>' + r.porcentaje + '%</td>';
    globalHtml += '<td>' + r.maxTantos + '</td>';
    globalHtml += '<td>' + r.cierres + '</td>';
    globalHtml += '<td>' + r.pegues + '</td>';
    globalHtml += '<tr>';
  }
  globalHtml += '</tbody><tr></div>';
  document.getElementById('statsGlobal').innerHTML = globalHtml;
  
  // Selector detalle
  const selectDetalle = document.getElementById('selectJugadorDetalle');
  if (selectDetalle) {
    selectDetalle.innerHTML = '<option value="">Seleccionar jugador...</option>';
    Object.keys(bd.estadisticasJugador).sort().forEach(nom => {
      const opt = document.createElement('option');
      opt.value = nom;
      opt.textContent = nom;
      selectDetalle.appendChild(opt);
    });
  }
}

function mostrarDetalleJugador(nombre) {
  const bd = cargarBD();
  const stats = bd.estadisticasJugador[nombre];
  if (!stats) return;
  
  const porcentajeMojon = stats.partidasJugadas > 0 ? ((stats.vecesMojon / stats.partidasJugadas) * 100).toFixed(1) : 0;
  
  let minTantosMostrar = 0;
  if (stats.minTantos && stats.minTantos !== Infinity && stats.minTantos !== 0) {
    minTantosMostrar = stats.minTantos;
  }
  
  let html = `
    <div class="detalle-jugador">
      <div class="detalle-header">
        <span class="detalle-nombre">🎯 ${nombre}</span>
      </div>
      <div class="detalle-grid">
        <div class="detalle-item">
          <span class="detalle-label">📊 Partidas jugadas</span>
          <span class="detalle-valor">${stats.partidasJugadas || 0}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">🃏 Manos totales</span>
          <span class="detalle-valor">${stats.manosTotales || 0}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">💩 Veces MOJÓN</span>
          <span class="detalle-valor">${stats.vecesMojon || 0} <span class="detalle-sub">(${porcentajeMojon}%)</span></span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">🐪 Máximo tantos (Gorda)</span>
          <span class="detalle-valor">${stats.maxTantos || 0}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">🍼 Mínimo tantos</span>
          <span class="detalle-valor">${minTantosMostrar}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">🔤 Letras acumuladas</span>
          <span class="detalle-valor">${stats.totalLetrasAcumuladas || 0}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">🏆 Veces que cerró</span>
          <span class="detalle-valor">${stats.vecesCierre || 0}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">🎯 Veces que pegó</span>
          <span class="detalle-valor">${stats.vecesPegue || 0}</span>
        </div>
      </div>
    </div>
  `;
  document.getElementById('detalleJugador').innerHTML = html;
}

// ========== IMPORTAR/EXPORTAR ==========
function exportarDatos() {
  const bd = cargarBD();
  const dataStr = JSON.stringify(bd, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `apunta-mojon-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  mostrarMensaje('Exportación completa', 'Los datos han sido exportados correctamente.', '📁');
}

function importarDatos(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.partidas !== undefined) {
        localStorage.setItem('mojon_bd', JSON.stringify(data));
        mostrarMensaje('Importación completa', 'Datos importados correctamente. La página se recargará.', '✅');
        setTimeout(() => {
          actualizarTablasEstadisticas();
          location.reload();
        }, 1500);
      } else {
        mostrarMensaje('Error', 'El archivo no es válido para ApuntaMOJÓN', '❌');
      }
    } catch (err) {
      mostrarMensaje('Error', 'No se pudo leer el archivo', '❌');
    }
  };
  reader.readAsText(file);
}

function limpiarBaseDeDatos() {
  modalPassword.style.display = 'flex';
  
  const btnConfirmar = document.getElementById('btnConfirmarPassword');
  const btnCancelar = document.getElementById('btnCancelarPassword');
  const passwordInput = document.getElementById('passwordInput');
  
  const handlerConfirmar = () => {
    const password = passwordInput.value;
    if (password === 'mojon') {
      localStorage.removeItem('mojon_bd');
      localStorage.removeItem('mojon_partidaActiva');
      mostrarMensaje('Base de datos limpiada', 'Todos los datos han sido eliminados correctamente.', '🗑️');
      setTimeout(() => {
        location.reload();
      }, 1500);
    } else {
      mostrarMensaje('Contraseña incorrecta', 'La contraseña ingresada no es válida.', '🔐');
    }
    modalPassword.style.display = 'none';
    passwordInput.value = '';
    btnConfirmar.removeEventListener('click', handlerConfirmar);
    btnCancelar.removeEventListener('click', handlerCancelar);
  };
  
  const handlerCancelar = () => {
    modalPassword.style.display = 'none';
    passwordInput.value = '';
    btnConfirmar.removeEventListener('click', handlerConfirmar);
    btnCancelar.removeEventListener('click', handlerCancelar);
  };
  
  btnConfirmar.removeEventListener('click', handlerConfirmar);
  btnCancelar.removeEventListener('click', handlerCancelar);
  btnConfirmar.addEventListener('click', handlerConfirmar);
  btnCancelar.addEventListener('click', handlerCancelar);
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      if (tabId === 'diario') document.getElementById('tabDiario').classList.add('active');
      if (tabId === 'global') document.getElementById('tabGlobal').classList.add('active');
      if (tabId === 'detalle') document.getElementById('tabDetalle').classList.add('active');
    });
  });
}

// ========== AYUDA - CORREGIDO ==========
function abrirManual() {
  // Abre el manual en una nueva pestaña/ventana
  window.open('./manual_apuntamojon.html', '_blank');
}

// ========== EVENTOS ==========
numJugadoresSelect.addEventListener('change', () => {
  if (!partidaActiva) {
    mostrarCamposNombres();
  }
});
btnIniciar.addEventListener('click', iniciarPartida);
btnCancelar.addEventListener('click', cancelarPartida);
btnAnotacion.addEventListener('click', abrirModalAnotacion);
btnEstadisticas.addEventListener('click', () => {
  actualizarTablasEstadisticas();
  modalEstadisticas.style.display = 'flex';
});
btnImportExport.addEventListener('click', () => {
  modalImportExport.style.display = 'flex';
});
btnAyuda.addEventListener('click', abrirManual);

document.getElementById('btnCerrarStats').onclick = () => modalEstadisticas.style.display = 'none';
document.getElementById('btnAceptarAnotacion').onclick = aceptarAnotacion;
document.getElementById('btnCancelarAnotacion').onclick = () => modalAnotacion.style.display = 'none';
document.getElementById('btnExportar').onclick = exportarDatos;
document.getElementById('btnImportar').onclick = () => document.getElementById('fileImport').click();
document.getElementById('btnCerrarImport').onclick = () => modalImportExport.style.display = 'none';
document.getElementById('btnLimpiarBD').onclick = limpiarBaseDeDatos;
document.getElementById('fileImport').onchange = (e) => {
  if (e.target.files[0]) importarDatos(e.target.files[0]);
  modalImportExport.style.display = 'none';
};
document.getElementById('btnCerrarFinal').onclick = cerrarModalFinal;

document.getElementById('selectJugadorDetalle').addEventListener('change', (e) => {
  if (e.target.value) mostrarDetalleJugador(e.target.value);
});

window.onclick = (e) => {
  if (e.target === modalAnotacion) modalAnotacion.style.display = 'none';
  if (e.target === modalEstadisticas) modalEstadisticas.style.display = 'none';
  if (e.target === modalImportExport) modalImportExport.style.display = 'none';
  if (e.target === modalFinal) modalFinal.style.display = 'none';
  if (e.target === modalMensaje) modalMensaje.style.display = 'none';
  if (e.target === modalConfirmacion) modalConfirmacion.style.display = 'none';
  if (e.target === modalPassword) modalPassword.style.display = 'none';
};

// ========== INICIALIZACIÓN ==========
mostrarCamposNombres();
cargarEstadoLocal();
actualizarTablasEstadisticas();
initTabs();
