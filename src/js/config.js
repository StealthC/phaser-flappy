SystemJS.config({
  baseURL: '/js',
});
System.defaultJSExtensions = true;
window.onload = () => {
  SystemJS.import('index.js');
};