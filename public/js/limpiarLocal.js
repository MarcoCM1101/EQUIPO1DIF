/*global localStorage*/
window.addEventListener('beforeunload', function () {
    // Borrar todo el localStorage
    localStorage.clear();
});
