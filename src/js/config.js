SystemJS.config({
  baseURL: 'js',
});
System.defaultJSExtensions = true;
window.onload = function() {
  SystemJS.import('index.js');
};