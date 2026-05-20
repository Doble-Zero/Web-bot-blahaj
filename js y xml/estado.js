// Lógica dinámica para la página de Estado de Bot Blåhaj
const lang = document.documentElement.lang || 'es';

// Traducciones
const textos = {
    es: {
        online: "Todos los sistemas operativos",
        offline: "Sistemas fuera de línea",
        cargando: "Cargando estado del bot...",
        errorFetch: "Error al conectar con el servidor",
        segundo: "Hace 1 segundo",
        segundos: "Hace {n} segundos",
        minuto: "Hace 1 minuto",
        minutos: "Hace {n} minutos",
        justNow: "Actualizado hace un momento",
        operativo: "Operativo",
        fueraServicio: "Fuera de servicio"
    },
    en: {
        online: "All systems operational",
        offline: "Systems offline",
        cargando: "Loading bot status...",
        errorFetch: "Error connecting to the server",
        segundo: "1 second ago",
        segundos: "{n} seconds ago",
        minuto: "1 minute ago",
        minutos: "{n} minutes ago",
        justNow: "Updated just now",
        operativo: "Operational",
        fueraServicio: "Offline"
    }
};

const t = textos[lang] || textos.es;

let lastDataTimestamp = null;
let lastFetchTime = null;
let updateIntervalId = null;

// Inicializar la carga al abrir la página
document.addEventListener("DOMContentLoaded", () => {
    actualizarEstado();
    // Consultar el estado cada 15 segundos
    setInterval(actualizarEstado, 15000);

    // Iniciar el temporizador visual que incrementa el contador de "Última actualización" cada segundo
    iniciarTemporizadorVisual();
});

function actualizarEstado() {
    fetch('../estado.json?t=' + Date.now()) // query string para evitar cache de Apache
        .then(response => {
            if (!response.ok) throw new Error("Status " + response.status);
            return response.json();
        })
        .then(data => {
            renderizarDatos(data);
        })
        .catch(err => {
            console.error("Error al leer estado.json:", err);
            renderizarOffline(t.errorFetch);
        });
}

function renderizarDatos(data) {
    const nowEpoch = Math.floor(Date.now() / 1000);
    const dataEpoch = data.timestamp;
    
    // Calcular la antigüedad de los datos.
    // Si la hora del cliente está desfasada hacia atrás, forzamos un mínimo de 0.
    const antiguedad = Math.max(0, nowEpoch - dataEpoch);

    // Guardar para el temporizador visual
    lastDataTimestamp = dataEpoch;
    lastFetchTime = Date.now();

    // El bot se considera offline si la última actualización del JSON supera los 120 segundos (2 minutos)
    const isOnline = data.online && (antiguedad < 120);

    // 1. Actualizar el Banner Principal
    const indicator = document.getElementById("status-indicator");
    const bannerText = document.getElementById("status-banner-text");
    
    if (isOnline) {
        indicator.className = "status-indicator status-online";
        bannerText.textContent = t.online;
        bannerText.className = "text-success";
    } else {
        indicator.className = "status-indicator status-offline";
        bannerText.textContent = t.offline;
        bannerText.className = "text-danger";
    }

    // 2. Actualizar las tarjetas de Métricas
    document.getElementById("metric-ping").textContent = isOnline ? (data.ping + " ms") : "--";
    document.getElementById("metric-servers").textContent = isOnline ? formatearNumero(data.servidores) : "--";
    document.getElementById("metric-users").textContent = isOnline ? formatearNumero(data.usuarios) : "--";
    document.getElementById("metric-uptime").textContent = isOnline ? data.uptime : "--";

    // Actualizar el contador de tiempo transcurrido
    actualizarTextoAntiguedad();

    // 3. Actualizar la lista de subservicios
    actualizarSubservicio("sub-gateway", isOnline && data.subservicios.gateway);
    actualizarSubservicio("sub-database", isOnline && data.subservicios.database);
    actualizarSubservicio("sub-moderation", isOnline && data.subservicios.moderation);
    actualizarSubservicio("sub-pole", isOnline && data.subservicios.pole);
}

function renderizarOffline(mensajeError) {
    const indicator = document.getElementById("status-indicator");
    const bannerText = document.getElementById("status-banner-text");

    indicator.className = "status-indicator status-offline";
    bannerText.textContent = t.offline;
    bannerText.className = "text-danger";

    document.getElementById("metric-ping").textContent = "--";
    document.getElementById("metric-servers").textContent = "--";
    document.getElementById("metric-users").textContent = "--";
    document.getElementById("metric-uptime").textContent = "--";

    document.getElementById("metric-last-update").textContent = mensajeError;

    // Apagar subservicios
    actualizarSubservicio("sub-gateway", false);
    actualizarSubservicio("sub-database", false);
    actualizarSubservicio("sub-moderation", false);
    actualizarSubservicio("sub-pole", false);
}

function actualizarSubservicio(elementId, isWorking) {
    const item = document.getElementById(elementId);
    if (!item) return;

    const dot = item.querySelector(".subservicio-dot");
    const label = item.querySelector(".subservicio-estado-label");

    if (isWorking) {
        dot.className = "subservicio-dot online";
        label.textContent = t.operativo;
        label.className = "subservicio-estado-label text-success";
    } else {
        dot.className = "subservicio-dot offline";
        label.textContent = t.fueraServicio;
        label.className = "subservicio-estado-label text-danger";
    }
}

function iniciarTemporizadorVisual() {
    if (updateIntervalId) clearInterval(updateIntervalId);

    updateIntervalId = setInterval(() => {
        if (lastDataTimestamp !== null) {
            actualizarTextoAntiguedad();
        }
    }, 1000);
}

function actualizarTextoAntiguedad() {
    const nowEpoch = Math.floor(Date.now() / 1000);
    // Calculamos basándonos en la hora en que se recibió el último dato y su timestamp original,
    // sumando el tiempo que ha transcurrido desde el fetch local para mayor precisión.
    const transcurridoLocal = Math.floor((Date.now() - lastFetchTime) / 1000);
    const antiguedadTotal = Math.max(0, (nowEpoch - lastDataTimestamp) + transcurridoLocal - (nowEpoch - Math.floor(lastFetchTime/1000)));

    const spanText = document.getElementById("metric-last-update");
    if (!spanText) return;

    if (antiguedadTotal >= 120) {
        spanText.textContent = t.offline;
        // Si detectamos que superó el umbral en el temporizador visual antes del próximo fetch,
        // forzamos la interfaz a offline.
        renderizarOffline(t.offline);
    } else if (antiguedadTotal < 5) {
        spanText.textContent = t.justNow;
    } else if (antiguedadTotal < 60) {
        spanText.textContent = t.segundos.replace("{n}", antiguedadTotal);
    } else {
        const mins = Math.floor(antiguedadTotal / 60);
        const secs = antiguedadTotal % 60;
        if (mins === 1) {
            spanText.textContent = t.minuto;
        } else {
            spanText.textContent = t.minutos.replace("{n}", mins);
        }
    }
}

function formatearNumero(num) {
    if (num === undefined || num === null) return "--";
    // Formatear números con puntos (ej. 75.430)
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
