export let velocity = 0.0;
export let acceleration = 0.0;
export let temperature = 0.0;
export let current = 0.0;
export let voltage = 0.0;

export function updateMetrics() {
  velocity = parseFloat((Math.random() * 50).toFixed(2));
  acceleration = parseFloat((Math.random() * 20).toFixed(2));
  temperature = parseFloat((Math.random() * 100).toFixed(2));
  current = parseFloat((Math.random() * 10).toFixed(2));
  voltage = parseFloat((Math.random() * 240).toFixed(2));
}
