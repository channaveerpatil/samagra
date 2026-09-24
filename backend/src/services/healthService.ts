export interface HealthStatus {
  status: 'ok backend';
}

export function getHealthStatus(): HealthStatus {
  return { status: 'ok backend' };
}
