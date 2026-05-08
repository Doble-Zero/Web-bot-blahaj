// ==========================================
// NO TENGO NI PUTA IDEA QUE HACE ESTO, PERO EHHH FUNCIONA. GRACIAS GEMINI. <3
// ==========================================

// Variables globales para guardar los datos leídos del XML
let roadmapData = [];

// 1. Mostrar mensaje inicial
document.getElementById('estado').textContent = 'Cargando tareas del Roadmap...';

// 2. Fetch del XML
fetch('../js/datos.xml')
    .then(respuesta => {
        if (!respuesta.ok) throw new Error("Error HTTP " + respuesta.status);
        return respuesta.text();
    })
    .then(texto => {
        // 3. Convertir el texto en un documento XML navegable
        const parser = new DOMParser();
        const xml = parser.parseFromString(texto, 'text/xml');

        // 4. Leer todos los nodos <tarea>
        const tareas = xml.querySelectorAll('tarea');

        // Guardar la información en nuestro array
        tareas.forEach(tarea => {
            const fechaNode = tarea.querySelector('fecha');
            roadmapData.push({
                titulo: tarea.querySelector('titulo').textContent,
                prioridad: tarea.querySelector('prioridad').textContent,
                estado: tarea.querySelector('estado').textContent,
                descripcion: tarea.querySelector('descripcion').textContent,
                fecha: fechaNode ? fechaNode.textContent : null
            });
        });

        // Renderizado inicial (Mostramos todas las tareas)
        filtrarRoadmap('Todas');

        // Ocultar mensaje de carga
        document.getElementById('estado').style.display = 'none';
    })
    .catch(error => {
        document.getElementById('estado').textContent = 'Error al cargar el roadmap. Abre esto con Live Server y asegúrate de que datos.xml existe.';
        console.error('Error:', error);
    });

// ==========================================
// FUNCIÓN DE FILTRADO Y RENDERIZADO DINÁMICO
// ==========================================
function filtrarRoadmap(prioridadDeseada) {
    const contenedor = document.getElementById('lista-roadmap');
    contenedor.innerHTML = ''; // Limpiar la lista actual

    // Actualizar botones visuales del Aside
    const botones = document.querySelectorAll('.filtro-btn');
    botones.forEach(btn => {
        if (btn.textContent.includes(prioridadDeseada) || (prioridadDeseada === 'Todas' && btn.textContent === 'Ver Todas')) {
            btn.style.background = '#6f7bff';
            btn.style.fontWeight = 'bold';
        } else {
            btn.style.background = 'rgba(255,255,255,0.1)';
            btn.style.fontWeight = 'normal';
        }
    });

    // Filtrar los datos
    const tareasFiltradas = roadmapData.filter(tarea => {
        return prioridadDeseada === 'Todas' || tarea.prioridad === prioridadDeseada;
    });

    // Generar el HTML (DOM) de las tarjetas
    tareasFiltradas.forEach(tarea => {
        const tarjeta = document.createElement('div');
        // Usamos estilos inline que encajen con tu diseño original oscuro
        tarjeta.style.background = 'rgba(0, 0, 0, 0.2)';
        tarjeta.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        tarjeta.style.padding = '15px';
        tarjeta.style.borderRadius = '8px';
        tarjeta.style.cursor = 'pointer';
        tarjeta.style.transition = '0.2s';

        // Efecto hover simple por JS
        tarjeta.onmouseover = () => tarjeta.style.background = 'rgba(255, 255, 255, 0.05)';
        tarjeta.onmouseout = () => tarjeta.style.background = 'rgba(0, 0, 0, 0.2)';

        // Añadir el evento de Clic para abrir el modal
        tarjeta.onclick = function () {
            abrirModal(tarea.titulo, tarea.descripcion, tarea.prioridad, tarea.fecha);
        };

        // Seleccionar icono o color dependiendo de la prioridad
        let colorPrioridad = '#6fe5ff';
        let iconoPrioridad = '';
        if (tarea.prioridad === 'Alta') { colorPrioridad = '#ff4d4d'; iconoPrioridad = '🔴'; }
        if (tarea.prioridad === 'Media') { colorPrioridad = '#ffcc00'; iconoPrioridad = '🟡'; }
        if (tarea.prioridad === 'Baja') { colorPrioridad = '#33cc33'; iconoPrioridad = '🟢'; }
        if (tarea.prioridad === 'Completado') { colorPrioridad = '#6f7bff'; iconoPrioridad = '✅'; }
        if (tarea.prioridad === 'Errores') { colorPrioridad = '#ff9933'; iconoPrioridad = '🐛'; }

        let fechaHTML = tarea.fecha ? `<span style="font-size: 0.8em; color: rgba(255,255,255,0.4);">${tarea.fecha}</span>` : '';

        // Inyectar HTML
        tarjeta.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: white;">${iconoPrioridad} ${tarea.titulo}</h3>
                ${fechaHTML}
            </div>
            <p style="color: rgba(255,255,255,0.7); font-size: 0.9em; margin-top: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${tarea.descripcion}
            </p>
        `;

        contenedor.appendChild(tarjeta);
    });
}

// ==========================================
// LÓGICA DEL MODAL
// ==========================================
const modal = document.getElementById('miModal');

function abrirModal(titulo, desc, prioridad, fecha) {
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-desc').textContent = desc;

    const fechaEl = document.getElementById('modal-fecha');
    if (fecha) {
        fechaEl.style.display = 'block';
        fechaEl.textContent = "📅 " + fecha;
    } else {
        fechaEl.style.display = 'none';
    }

    const etiqueta = document.getElementById('modal-etiqueta');
    etiqueta.textContent = prioridad;

    // Cambiar el color de la etiqueta del modal según prioridad
    if (prioridad === 'Alta') { etiqueta.style.background = '#ff4d4d'; etiqueta.style.color = 'white'; }
    else if (prioridad === 'Media') { etiqueta.style.background = '#ffcc00'; etiqueta.style.color = 'black'; }
    else if (prioridad === 'Baja') { etiqueta.style.background = '#33cc33'; etiqueta.style.color = 'white'; }
    else if (prioridad === 'Completado') { etiqueta.style.background = '#6f7bff'; etiqueta.style.color = 'white'; }
    else if (prioridad === 'Errores') { etiqueta.style.background = '#ff9933'; etiqueta.style.color = 'black'; }

    modal.style.display = 'flex'; // Mostrar Modal
}

function toggleModal() {
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}
