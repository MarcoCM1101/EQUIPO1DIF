// Función para mostrar la hora actual
    function displayTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = hours + ':' + minutes;
        return timeString;
    }

    // Actualizar el contenido de la sección de la hora cada segundo
    function updateTime() {
        const timeElement = document.getElementById('time');
        if (timeElement) {
            timeElement.textContent = displayTime();
        }
    }

    // Llamar a updateTime cada segundo
    setInterval(updateTime, 1000);