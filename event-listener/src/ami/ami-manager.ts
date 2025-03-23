import AMI from 'yana';

let amiManager: typeof AMI;

export async function getAmiManager() {
  if (amiManager) {
    return amiManager;
  }

  // dynamic import yana module because it commonjs only
  amiManager = (await import('yana')).default;

  return amiManager;
}
